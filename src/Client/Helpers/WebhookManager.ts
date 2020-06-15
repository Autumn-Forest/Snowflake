import { Message, Client } from '..';
import { TextChannel, MessageEmbed, NewsChannel } from 'discord.js';

export default class WebhookManager {
	private client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	sendFirst = async (msg: Message, text: string, channel?: TextChannel, name?: string, pfp?: string) => {
		if (msg.channel.type !== 'text') return;
		channel = channel || msg.channel;
		name = name || msg.member?.displayName || msg.author.username;
		pfp = pfp || msg.author.displayAvatarURL();

		const webhook = await this.fetchFirst(channel);
		if (!webhook) return;

		if (this.client.helpers.missingPermissions(channel, ['MANAGE_WEBHOOKS'], 'self')) channel.send(text);
		else
			webhook.send(text, {
				username: name,
				avatarURL: pfp
			});
	};

	fetchFirst = async (channel: TextChannel) => {
		const webhooks = await channel.fetchWebhooks().catch(() => null);
		const webhook = webhooks?.first() || (await channel.createWebhook('basic', { reason: 'Automatic creation' }).catch(() => null));
		return webhook;
	};

	channelFetch = async (msg: Message, channel?: TextChannel) => {
		if (!channel) {
			if (!(msg.channel instanceof TextChannel)) return;
			channel = msg.channel;
		}
		return await channel.fetchWebhooks();
	};

	fetch = async (channel: TextChannel) => {
		return await channel.fetchWebhooks();
	};

	send = async (id: string, text?: string, embeds?: MessageEmbed, name?: string, pfp?: string) => {
		const webhook = await this.client.fetchWebhook(id).catch(() => null);
		if (!webhook) return;

		const channel = this.client.channels.cache.get(webhook.channelID) as TextChannel;
		if (!channel) return;

		if (this.client.helpers.missingPermissions(channel, ['MANAGE_WEBHOOKS'], 'self')) channel.send(text, { embed: embeds });
		else if (embeds)
			webhook.send(text, {
				username: name,
				avatarURL: pfp,
				embeds: [embeds]
			});
		else
			webhook.send(text, {
				username: name,
				avatarURL: pfp
			});
	};

	create = async (msg: Message, channel?: TextChannel | NewsChannel, name?: string, pfp?: string, reason?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) {
			if (!(msg.channel instanceof TextChannel)) return;
			channel = msg.channel;
		}

		name = name || msg.member?.displayName || msg.author.username;
		pfp = pfp || msg.author.displayAvatarURL();

		const webhook = await channel.createWebhook(name, { avatar: pfp, reason }).catch(() => null);
		return webhook?.id;
	};

	delete = async (id: string, reason?: string) => {
		const webhook = await this.client.fetchWebhook(id).catch(() => null);
		if (!webhook) return;
		webhook.delete(reason).catch(() => null);
	};
}
