import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'cuddle', msg.client.constants.actionStrings.cuddle.random());
};

export const command: Command = {
	name: 'cuddle',
	category: 'Fun',
	aliases: ['cuddles', 'snuggle', 'snuggles'],
	description: 'Cuddle your best friends :3',
	usage: '[Member]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
