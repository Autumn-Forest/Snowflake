import { Message, Command } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	await msg.channel.send('Okay, shutting down!');
};

export const command: Command = {
	name: 'shutdown',
	category: 'Dev',
	aliases: ['exit', 'goodnight'],
	usage: '',
	devOnly: true,
	nsfw: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
