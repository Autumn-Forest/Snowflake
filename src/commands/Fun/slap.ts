import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'slap', msg.client.constants.actionStrings.slap.random());
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
