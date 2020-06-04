import { Client, Message } from '../Client';

export const listener = async (client: Client, msg: Message) => {
	if (msg.author?.bot || msg.partial) return;

	const settings = await client.cache.getGuild(msg);
	if (!settings) return;
	const logWebhook = settings.channels.messageLogWebhook;
	if (!logWebhook) return;

	const logEmbed = client
		.newEmbed('INFO')
		.setTitle('Message deleted')
		.setDescription(msg.content)
		.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
		.addFields([
			{ name: 'Channel', value: msg.channel, inline: true },
			{ name: 'Message ID', value: msg.id, inline: true },
			{ name: 'Member', value: `${msg.author} - ${msg.author.tag} - ${msg.author.id}` }
		]);

	return msg.client.webhooks.send(logWebhook, '', logEmbed);
};
