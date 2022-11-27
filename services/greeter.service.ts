import type { Context, Service, ServiceSchema } from "moleculer";

export interface ActionHelloParams {
	name: string;
}

interface GreeterSettings {
	defaultName: string;
}

interface GreeterMethods {
	uppercase(str: string): string;
}

interface GreeterLocalVars {
	myVar: string;
}

type GreeterThis = Service<GreeterSettings> & GreeterMethods & GreeterLocalVars;

const GreeterService: ServiceSchema<GreeterSettings> = {
	name: "greeter",

	/**
	 * Settings
	 */
	settings: {
		defaultName: "Moleculer",
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		hello: {
			rest: {
				method: "GET",
				path: "/hello",
			},
			async handler(this: GreeterThis, ctx: Context): Promise<string> {
				return ctx.call("greeter.welcome", { name: this.settings.defaultName });
			},
		},

		welcome: {
			rest: "GET /welcome/:name",
			params: {
				name: "string",
			},
			handler(this: GreeterThis, ctx: Context<ActionHelloParams>): string {
				const name = this.uppercase(ctx.params.name);
				return `Hello ${name}`;
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		uppercase(str: string): string {
			return str.toUpperCase();
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created(this: GreeterThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};

export default GreeterService;
