import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const kisses = msg.client.constants.stringsKisses;
	return msg.client.nekos.sendImage(msg, args, 'kiss', kisses[Math.floor(Math.random() * kisses.length)]);
};

export const command: Command = {
	name: 'kiss',
	category: 'Fun',
	aliases: ['kisses'],
	description: 'Kiss you lover :3',
	usage: '<@member|nickname>',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
