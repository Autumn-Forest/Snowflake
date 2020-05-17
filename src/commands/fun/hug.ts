import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.client.nekos.sendImage(msg, args, 'hug', '{{USER}} hugs {{MEMBER}}');
};

export const command: Command = {
	name: 'hug',
	category: 'fun',
	aliases: ['huggu'],
	description: 'Hugs your favorites friends!',
	usage: '',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
