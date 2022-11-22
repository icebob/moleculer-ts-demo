import { Context, Service, ServiceSchema } from "moleculer";

export type ActionHelloParams = {
    name: string;
};

export type GreeterSettings = {
    defaultName: string;
}

type GreeterMethods = {
	uppercase(str: string): string
}

type GreeterLocalVars = {
	myVar: string
}

type GreeterThis = Service<GreeterSettings> & GreeterMethods & GreeterLocalVars;

const GreeterService: ServiceSchema<GreeterSettings> & { methods: GreeterMethods } = {
    name: "greeter",

	/**
	 * Settings
	 */
    settings: {
        defaultName: "Moleculer"
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
				path: "/hello"
			},
            handler(this: GreeterThis): string {
                return `Hello ${this.settings.defaultName}`;
            }
        },

        welcome: {
            rest: "GET /welcome/:name",
            params: {
                name: "string"
            },
            handler(this: GreeterThis, ctx: Context<ActionHelloParams>): string {
				const name = this.uppercase(ctx.params.name);
                return `Hello ${name}`;
            }
        }
    },

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		uppercase(str: string): string {
			return str.toUpperCase();
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created(this: GreeterThis) {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};

export default GreeterService;
