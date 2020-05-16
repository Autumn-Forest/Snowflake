import { Client } from './Client';

const client = new Client({
	debug: false
});

client.login(client.config.token);

process.on('uncaughtException', client.handleError);
process.on('unhandledRejection', err => {
	if (!err) err = new Error('An Unhandled Promise Rejection occurred but it had no error!');
	// @ts-ignore
	if (err.stack && err.name) client.handleError(err);
	else console.error(err);
});
