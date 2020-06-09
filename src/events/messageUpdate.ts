import { Client, Message } from '../Client';

export const listener = async (client: Client, oldMsg: Message, newMsg: Message) => {
	if (oldMsg.partial) return;

	if (oldMsg.author.bot || oldMsg.content === newMsg.content) return;

	const lastCommand = client.recentCommands.get(oldMsg.author.id);

	if (lastCommand && lastCommand.channelID === newMsg.channel.id && lastCommand.msgID === oldMsg.id) {
		lastCommand.res.delete().catch(() => null);
	}
	client.emit('message', newMsg);

	const settings = await client.cache.getGuild(newMsg);
	if (!settings) return;
	const logWebhook = settings.channels.messageLogWebhook;
	if (!logWebhook) return;

	const logEmbed = client
		.newEmbed('INFO')
		.setTitle('Message edited')
		.setThumbnail(newMsg.author.displayAvatarURL({ dynamic: true }))
		.addFields([
			{ name: 'Channel', value: newMsg.channel, inline: true },
			{ name: 'Message ID', value: `[${newMsg.id}](${newMsg.url})`, inline: true },
			{ name: 'Before', value: oldMsg.content.shorten(1024) || '-' },
			{ name: 'After', value: newMsg.content.shorten(1024) || '-' }
		]);

	return client.webhooks.send(logWebhook, '', logEmbed);
};
