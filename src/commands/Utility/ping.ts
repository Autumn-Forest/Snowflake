import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const sentMsg = await msg.channel.send('Pinging...');
	return sentMsg.edit(`Pong! Took \`${sentMsg.createdTimestamp - (msg.editedTimestamp || msg.createdTimestamp)}ms\`.`);
};

export const command: Command = {
	cooldown: 10,
	aliases: ['heartbeat', 'ms'],
	description: 'Check my ping',
	usage: '',
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
