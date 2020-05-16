import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const sentMsg = await msg.channel.send('Pinging...');
	return sentMsg.edit(`Pong! Took \`${sentMsg.createdTimestamp - msg.createdTimestamp}ms\`. Ayy it worked!`);
};

export const command: Command = {
	name: 'ping',
	category: 'Utility',
	aliases: ['heartbeat', 'ms'],
	usage: '',
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
