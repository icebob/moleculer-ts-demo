import { Context, ServiceSchema } from "moleculer";

export type ActionHelloParams = {
    name: string;
};

export type GreeterSettings = {
    defaultName: string;
}

const GreeterService: ServiceSchema<GreeterSettings> = {
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
            handler() {
                return `Hello ${this.settings.defaultName}`;
            }
        },

        welcome: {
            rest: "GET /welcome/:name",
            params: {
                name: "string"                
            },            
            handler(ctx: Context<ActionHelloParams>) {
                return `Hello ${ctx.params.name}`;
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

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

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