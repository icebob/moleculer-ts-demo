"use strict";

import { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, MoleculerDB, MoleculerDbMethods } from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";

import DbService from "moleculer-db";
import fs from "fs";

export type DbServiceMethods = {
	seedDb?(): Promise<void>;
}

type DbServiceSchema = Partial<ServiceSchema> & Partial<MoleculerDB<DbAdapter>> & {
	collection?: string;
};

export type DbServiceThis = Service & DbServiceMethods;

export default function(collection: string): DbServiceSchema {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema: DbServiceSchema = {
		mixins: [DbService],

		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName](this: DbServiceThis) {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			}
		},

		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {any} json
			 * @param {Context} ctx
			 */
			async entityChanged(
				type: string,
				json: any,
				ctx: Context
			): Promise<void> {
				ctx.broadcast(cacheCleanEventName);
			},

		},

		async started(this: DbServiceThis) {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const count = await this.adapter.count();
				if (count == 0) {
					this.logger.info(`The '${collection}' collection is empty. Seeding the collection...`);
					await this.seedDB();
					this.logger.info("Seeding is done. Number of records:", await this.adapter.count());
				}
			}
		}
	};

	if (process.env.MONGO_URI) {
		// Mongo adapter
		schema.adapter = new MongoDbAdapter(process.env.MONGO_URI);
		schema.collection = collection;
	} else if (process.env.NODE_ENV === 'test') {
		// NeDB memory adapter for testing
		schema.adapter = new DbService.MemoryAdapter();
	} else {
		// NeDB file DB adapter

		// Create data folder
		if (!fs.existsSync("./data")) {
			fs.mkdirSync("./data");
		}

		schema.adapter = new DbService.MemoryAdapter({ filename: `./data/${collection}.db` });
	}

	return schema;
};
