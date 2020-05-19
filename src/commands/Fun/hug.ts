import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const hugs = msg.client.constants.actionStrings.hug;
	return msg.client.nekos.sendImage(msg, args, 'hug', hugs[Math.floor(Math.random() * hugs.length)]);
};

export const command: Command = {
	name: 'hug',
	category: 'Fun',
	aliases: ['huggu', 'hugs'],
	description: 'Hug your friends!',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
