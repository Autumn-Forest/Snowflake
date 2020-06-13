import { Message, Command } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	await msg.channel.send('Okay, shutting down!');
	msg.client.destroy();
	process.exit();
};

export const command: Command = {
	aliases: ['exit', 'goodnight', 'die', 'kys'],
	description: '~~Kill~~ I mean, make the bot sleep.',
	usage: '',
	devOnly: true,
	nsfw: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
