import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;
	if (!args[0]) args = ['false'];
	const arg = args[0].toLowerCase() === 'on';
	settings.settings.nsfw = arg;
	settings.save();
	return msg.channel.send(`Successfully ${arg ? 'enabled' : 'disabled'} NSFW commands!`);
};

export const command: Command = {
	name: 'togglensfw',
	category: 'Settings',
	aliases: ['nsfw'],
	description: 'Toggle NSFW commands',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
	botPermission: [],
	callback: callback
};
