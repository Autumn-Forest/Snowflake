import { Message } from '../../Client';
import { Util } from './util';
import { TextChannel } from 'discord.js';
export class Webhooks extends Util {
	sendFirst = async (msg: Message, text: string, channel?: TextChannel, name?: string, pfp?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) channel = msg.channel;
		if (!name) name = msg.member.displayName;
		if (!pfp) pfp = msg.author.displayAvatarURL();

		const webhook = await this.fetchFirst(channel);
		return webhook?.send(text, {
			username: name,
			avatarURL: pfp
		});
	};

	fetchFirst = async (channel: TextChannel) => {
		const webhooks = await channel.fetchWebhooks();
		let webhook;
		if (!webhooks.first()) webhook = await channel.createWebhook('basic', { reason: 'Automatic creation' });
		else webhook = webhooks.first();
		return webhook;
	};

	channelFetch = async (channel: TextChannel) => {
		const webhooks = await channel.fetchWebhooks();
		return webhooks;
	};

	send = async (id: string, text: string, name?: string, pfp?: string) => {
		const webhook = await this.client.fetchWebhook(id);
		return webhook.send(text, {
			username: name,
			avatarURL: pfp
		});
	};

	create = async (msg: Message, channel?: TextChannel, name?: string, pfp?: string, reason?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) channel = msg.channel;
		if (!name) name = msg.member.displayName;
		if (!pfp) pfp = msg.author.displayAvatarURL();

		const webhook = await channel.createWebhook(name, { avatar: pfp, reason });
		return webhook.id;
	};

	delete = async (id: string, reason?: string) => {
		const webhook = await this.client.fetchWebhook(id);
		webhook.delete(reason);
	};
}
