import { Client, Message } from '../Client';
import { TextChannel } from 'discord.js';

export const listener = async (client: Client, msg: Message) => {
	if (msg.author?.bot) return;

	const settings = await client.cache.getGuild(msg);
	if (!settings) return;
	const logChannel = msg.guild?.channels.cache.get(settings?.channels.messageLogChannel);
	if (!logChannel || !(logChannel instanceof TextChannel)) return;

	const logEmbed = client
		.newEmbed('INFO')
		.setTitle('Message deleted')
		.setDescription('This message was not cached, so I sadly cannot display more info than this ( ≧Д≦)')
		.addFields([
			{ name: 'Channel', value: msg.channel, inline: true },
			{ name: 'Message ID', value: msg.id, inline: true }
		]);

	if (msg.partial) return logChannel.send(logEmbed);

	logEmbed
		.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
		.addField('Member', `${msg.author} - ${msg.author.tag} - ${msg.author.id}`)
		.setDescription(msg.content);

	return logChannel.send(logEmbed);
};
