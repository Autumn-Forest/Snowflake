import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'hug', '{{USER}} hugs {{MEMBER}}');
};

export const command: Command = {
	name: 'hug',
	category: 'Fun',
	aliases: ['huggu'],
	description: 'Hugs your friends!',
	usage: '[User]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
