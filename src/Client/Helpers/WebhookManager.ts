import { Message } from '..';
import { Util } from './util';
import { TextChannel, MessageEmbed } from 'discord.js';

export class WebhookManager extends Util {
	sendFirst = async (msg: Message, text: string, channel?: TextChannel, name?: string, pfp?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) channel = msg.channel;
		if (!name) name = msg.member?.displayName || msg.author.username;
		if (!pfp) pfp = msg.author.displayAvatarURL();

		const webhook = await this.fetchFirst(channel);
		return webhook?.send(text, {
			username: name,
			avatarURL: pfp
		});
	};

	fetchFirst = async (channel: TextChannel) => {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first() || (await channel.createWebhook('basic', { reason: 'Automatic creation' }));
		return webhook;
	};

	channelFetch = async (msg: Message, channel?: TextChannel) => {
		if (!channel) {
			if (!(msg.channel instanceof TextChannel)) return;
			channel = msg.channel;
		}
		return await channel.fetchWebhooks();
	};
	// called _fetch cuz fetch already exist or smtg like that.
	_fetch = async (channel: TextChannel) => {
		return await channel.fetchWebhooks();
	};

	send = async (id: string, text?: string, embeds?: MessageEmbed, name?: string, pfp?: string) => {
		const webhook = await this.client.fetchWebhook(id);
		if (embeds) {
			return webhook.send(text, {
				username: name,
				avatarURL: pfp,
				embeds: [embeds]
			});
		} else {
			return webhook.send(text, {
				username: name,
				avatarURL: pfp
			});
		}
	};

	create = async (msg: Message, channel?: TextChannel, name?: string, pfp?: string, reason?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) {
			if (!(msg.channel instanceof TextChannel)) return;
			channel = msg.channel;
		}
		if (!name) name = msg.member?.displayName || msg.author.username;
		if (!pfp) pfp = msg.author.displayAvatarURL();

		const webhook = await channel.createWebhook(name, { avatar: pfp, reason });
		return webhook.id;
	};

	delete = async (id: string, reason?: string) => {
		const webhook = await this.client.fetchWebhook(id);
		webhook.delete(reason).catch(() => null);
	};
}
