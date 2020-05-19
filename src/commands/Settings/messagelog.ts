import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const channel = msg.mentions.channels.first()?.id || '';

	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;

	settings.channels.messageLogChannel = channel;
	settings.save();

	return msg.channel.send(`The message log ${channel ? `channel has successfully been set to <#${channel}>` : 'has successfully been disabled'}!`);
};

export const command: Command = {
	name: 'messagelog',
	category: 'Settings',
	aliases: ['log', 'setmessagelog'],
	description: 'Set the modlog-channel',
	usage: '[Channel]',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_CHANNELS', 'MANAGE_GUILD'],
	botPermission: [],
	callback: callback
};
