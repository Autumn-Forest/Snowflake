import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'slap', msg.client.constants.actionStrings.slap.random());
};

export const command: Command = {
	cooldown: 5,
	aliases: ['slaps'],
	description: 'Slap the mean baka!',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
