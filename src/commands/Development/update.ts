import { Command, Message } from '../../Client';
import { exec } from 'child_process';

const callback = async (msg: Message, args: string[]) => {
	let command = 'git pull && tsc';
	if (args.length && ['yes', 'restart', '1', 'y'].includes(args[0].toLowerCase())) command += ' && pm2 restart Snowflake';

	exec(command, (err, stdout, stderr) => {
		if (err) msg.channel.send((err.stack || err.message).shorten(2000).toCodeblock());
		if (stderr) msg.channel.send(stderr.shorten(2000).toCodeblock());
		if (stdout) msg.channel.send(stdout.shorten(2000).toCodeblock());
		if (!err && !stderr) {
			msg.client.getCommand('reload')?.callback(msg, []);
		}
	});
};

export const command: Command = {
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
