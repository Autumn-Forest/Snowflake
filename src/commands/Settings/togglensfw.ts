import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const settings = await msg.client.cache.getGuild(msg);

	let arg = !settings.settings.nsfw;
	if (args.length) arg = args[0].toLowerCase() === 'on' ? true : args[0].toLowerCase() === 'off' ? false : arg;

	settings.settings.nsfw = arg;
	settings.save();

	return msg.channel.send(`Successfully ${arg ? 'enabled' : 'disabled'} NSFW commands!`);
};

export const command: Command = {
	aliases: ['nsfw', 'tn', 'setnsfw'],
	description: 'Toggle NSFW commands',
	usage: '[on|off]',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
	botPermission: [],
	callback: callback
};
