import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'tickle', msg.client.constants.actionStrings.tickle.random());
};

export const command: Command = {
	name: 'tickle',
	category: 'Fun',
	aliases: ['tickles'],
	description: 'Tickle your friends :P',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
