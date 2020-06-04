import { Command, Message } from '../../Client';
import { exec } from 'child_process';

const callback = async (msg: Message, args: string[]) => {
	let command = 'git pull && tsc';
	if (args.length && ['yes', 'restart', '1', 'y'].includes(args[0].toLowerCase())) command += ' && pm2 restart Snowflake';

	exec(command, (err, stdout, stderr) => {
		if (err) msg.channel.send(msg.client.helpers.codeBlock(msg.client.helpers.trimString(err.stack || err.message, 2048)));
		if (stderr) msg.channel.send(msg.client.helpers.codeBlock(msg.client.helpers.trimString(stderr, 2048)));
		if (stdout) msg.channel.send(msg.client.helpers.codeBlock(msg.client.helpers.trimString(stdout, 2048)));
		if (!err && !stderr) {
			msg.client.getCommand('reload')?.callback(msg, []);
		}
	});
};

export const command: Command = {
	name: 'update',
	category: 'Dev',
	aliases: [],
	description: 'Apply the latest changes. git pull > tsc > reload',
	usage: '[restart?]',
	args: 0,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
