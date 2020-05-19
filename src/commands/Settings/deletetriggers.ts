import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;

	let arg = settings.settings.deleteCommandTriggers === false;
	if (args.length) arg = args[0].toLowerCase() === 'on' ? true : args[0].toLowerCase() === 'off' ? false : arg;

	settings.settings.deleteCommandTriggers = arg;
	settings.save();
	return msg.channel.send(`I will ${arg ? 'now' : 'no longer'} delete command triggers.`);
};

export const command: Command = {
	name: 'deletetriggers',
	category: 'Settings',
	aliases: ['deltriggers', 'dt'],
	description: 'Delete command triggers',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
	botPermission: ['MANAGE_MESSAGES'],
	callback: callback
};
