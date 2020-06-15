import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'kiss', msg.client.constants.actionStrings.kiss.random());
};

export const command: Command = {
	cooldown: 5,
	aliases: ['kisses'],
	description: 'Kiss your lover :3',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
