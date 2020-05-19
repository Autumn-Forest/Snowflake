import { Client, Message } from '../Client';
import { Collection } from 'discord.js';

export const listener = async (client: Client, messages: Collection<string, Message>) => {
	const msg = messages.first();
	if (!msg) return;

	const settings = await client.cache.getGuild(msg);
	if (!settings) return;
	const logWebhook = settings.channels.messageLogWebhook;
	if (!logWebhook) return;

	const output = client
		.newEmbed('INFO')
		.setTitle('Messages pruned')
		.addFields([
			{ name: 'Channel', value: msg.channel, inline: true },
			{ name: 'Amount', value: messages.size, inline: true }
		]);

	const log = await (await msg.guild?.fetchAuditLogs({ limit: 1, type: 'MESSAGE_BULK_DELETE' }))?.entries.first();
	if (log)
		output.setThumbnail(log.executor.displayAvatarURL({ dynamic: true })).addField('Bot', `${log.executor} - ${log.executor.tag} - ${log.executor.id}`);

	return msg.client.webhooks.send(logWebhook, '', output);
};
