import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const sentmsg = await msg.channel.send('Pinging...');
	return sentmsg.edit(`Pong! Took \`${msg.createdTimestamp - msg.createdTimestamp}ms\`. Ayy it worked!`);
};

export const command: Command = {
	name: 'ping',
	category: 'Utility',
	aliases: ['heartbeat', 'ms'],
	description: 'Give the ping of the bot',
	usage: '',
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
