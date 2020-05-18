import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const slaps = msg.client.constants.stringsSlaps;
	return msg.client.nekos.sendImage(msg, args, 'slap', slaps[Math.floor(Math.random() * slaps.length)]);
};

export const command: Command = {
	name: 'slap',
	category: 'Fun',
	aliases: ['slaps'],
	description: 'Slaps the means baka!',
	usage: '<@member|nickname>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
