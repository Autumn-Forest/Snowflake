import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const slaps = msg.client.constants.actionStrings.slap;
	return msg.client.nekos.sendImage(msg, args, 'slap', slaps[Math.floor(Math.random() * slaps.length)]);
};

export const command: Command = {
	name: 'slap',
	category: 'Fun',
	aliases: ['slaps'],
	description: 'Slaps the means baka!',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
