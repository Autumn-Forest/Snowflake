import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.getSettings(msg);
	if (!settings) return;
	if (!args[0]) args = ['false'];
	const arg = args[0].toLowerCase() === 'on';
	settings.settings.deleteCommandTriggers = arg;
	settings.save();
	return msg.channel.send(`I will ${arg ? 'now' : 'no longer'} delete commmand triggers :D`);
};

export const command: Command = {
	name: 'deletecommandtriggers',
	category: 'Settings',
	aliases: ['cmddelete', 'triggerdelete'],
	description: 'Delete the triggers of the commands.',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD'],
	botPermission: [],
	callback: callback
};
