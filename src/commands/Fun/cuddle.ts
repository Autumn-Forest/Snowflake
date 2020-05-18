import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const cuddles = msg.client.constants.stringsCuddles;
	return msg.client.nekos.sendImage(msg, args, 'cuddle', cuddles[Math.floor(Math.random() * cuddles.length)]);
};

export const command: Command = {
	name: 'cuddle',
	category: 'Fun',
	aliases: ['cuddles', 'snuggle', 'snuggles'],
	description: 'Cuddles your best friends :3',
	usage: '<@member|nickname>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
