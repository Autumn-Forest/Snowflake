import { Client, Message } from '../Client';

export const listener = async (client: Client, oldMsg: Message, newMsg: Message) => {
	if (oldMsg.partial) return;

	if (oldMsg.author.bot || oldMsg.content === newMsg.content) return;

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
			{ name: 'Before', value: newMsg.client.helpers.trimString(oldMsg.content || '-', 1024) },
			{ name: 'After', value: newMsg.client.helpers.trimString(newMsg.content || '-', 1024) }
		]);

	return client.webhooks.send(logWebhook, '', logEmbed);
};
