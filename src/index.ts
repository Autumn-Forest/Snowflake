import { Client } from './Client';

// Load extensions
import './interfaces/Array';
import './interfaces/String';
import './interfaces/Date';
import './interfaces/Number';

const client = new Client({
	debug: false,
	baseOptions: {
		disableMentions: 'everyone',
		presence: {
			activity: {
				name: `@Snowflake#2926`,
				type: 'LISTENING',
				url: 'https://www.twitch.tv/.'
			}
		},
		partials: ['MESSAGE', 'REACTION']
	}
});

client.start();

process.on('uncaughtException', client.handleError);
process.on('unhandledRejection', err => {
	if (!err) err = new Error('An Unhandled Promise Rejection occurred but it had no error!');
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	if (err.stack && err.name) client.handleError(err);
	else console.error(err);
});
