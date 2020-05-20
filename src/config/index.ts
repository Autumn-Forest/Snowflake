export const config: Config = require(`./${process.env.NODE_ENV}`).default;

interface Config {
	token: string;
	mongoString: string;
	defaultPrefix: string;
	developers: string[];
	gelbooruAPI: string;
	channels: {
		info: string;
		errors: string;
	};
	apiKeys: {
		gelbooru: {
			key: string;
			id: string;
		};
	};
}
