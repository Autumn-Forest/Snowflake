export default {
	defaultPrefix: '*',
	token: process.env.SNOWFLAKE_TOKEN,
	mongoString: process.env.SNOWFLAKE_DATABASE,
	developers: ['343383572805058560', '390977127153139733', '279910519467671554'],
	channels: {
		info: '711228013265813524',
		errors: '711228030982422529'
	},
	apiKeys: {
		gelbooru: {
			key: process.env.GELBOORU_KEY,
			id: process.env.GELBOORU_ID
		}
	}
};
