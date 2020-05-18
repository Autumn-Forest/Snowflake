import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;
	if (!args[0]) args = ['false'];
	const arg = args[0].toLowerCase() === 'on';
	settings.settings.deleteFailedCommands = arg;
	settings.save();
	return msg.channel.send(`I will ${arg ? 'now' : 'no longer'} delete failed commands.`);
};

export const command: Command = {
	name: 'deleteerrors',
	category: 'Settings',
	aliases: ['errordel'],
	description: 'Delete failed commands',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
	botPermission: ['MANAGE_MESSAGES'],
	callback: callback
};
