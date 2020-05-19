import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, _args: string[]) => {
	const channel = msg.mentions.channels.first()?.id || '';

	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;
	if (!channel) {
		await msg.client.webhooks.delete(settings.channels.messageLogWebhook, `Message logs got desactivated by ${msg.author.tag}`);
		settings.channels.messageLogWebhook = channel;
	} else {
		const leChannel = await msg.client.channels.fetch(channel);
		if (!(leChannel instanceof TextChannel)) return;
		const webhookID = await msg.client.webhooks.create(
			msg,
			leChannel,
			'Message Logger',
			'https://cdn.discordapp.com/avatars/709570149107367966/5a788241e762a89bae17019bcdcbec75.webp?size=2048',
			`${msg.author.tag} created a logger for messages.`
		);
		if (!webhookID) return;
		settings.channels.messageLogWebhook = webhookID;
	}
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
