import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'pat', msg.client.constants.actionStrings.pat.random());
};

export const command: Command = {
	name: 'pat',
	category: 'Fun',
	aliases: ['headpat', 'pet'],
	description: 'Pat your friends :3',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
