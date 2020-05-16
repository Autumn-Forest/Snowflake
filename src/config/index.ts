export const config: Config = require(`./${process.env.NODE_ENV}`).default;

interface Config {
	token: string;
	mongoString: string;
	defaultPrefix: string;
	developers: string[];
	channels: {
		info: string;
		errors: string;
	};
}
