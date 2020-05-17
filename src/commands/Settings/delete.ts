import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.getSettings(msg);
	if (!settings) return;
	if (!args[0]) args = ['false'];
	const arg = args[0].toLowerCase() === 'on';
	settings.settings.deleteCommandTriggers = arg;
	settings.save();
	if (arg)
		return msg.channel.send(
			`I'll now delete the commmand trigger :D\nDo \`${
				settings.settings.prefix || msg.client.config.defaultPrefix
			}cmddelete\` to desactivate this functionnality`
		);
	else
		return msg.channel.send(
			`I'll now stop to delete the command trigger :D\nDo \`${
				settings.settings.prefix || msg.client.config.defaultPrefix
			}cmddelete on\` to activate this functionnality`
		);
};

export const command: Command = {
	name: 'Command delete',
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
