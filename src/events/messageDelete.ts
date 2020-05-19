import { Client, Message } from '../Client';

export const listener = async (client: Client, msg: Message) => {
	if (msg.author?.bot) return;

	const settings = await client.cache.getGuild(msg);
	if (!settings) return;
	const logWebhook = settings.channels.messageLogWebhook;
	if (!logWebhook) return;

	const logEmbed = client
		.newEmbed('INFO')
		.setTitle('Message deleted')
		.setDescription('This message was not cached, so I sadly cannot display more info than this ( ≧Д≦)')
		.addFields([
			{ name: 'Channel', value: msg.channel, inline: true },
			{ name: 'Message ID', value: msg.id, inline: true }
		]);

	if (msg.partial) return msg.client.webhooks.send(logWebhook, '', logEmbed);

	logEmbed
		.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
		.addField('Member', `${msg.author} - ${msg.author.tag} - ${msg.author.id}`)
		.setDescription(msg.content);

	return msg.client.webhooks.send(logWebhook, '', logEmbed);
};
