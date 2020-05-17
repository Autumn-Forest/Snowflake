import { Message } from '../../Client';
import { Util } from './util';
import { TextChannel } from 'discord.js';
export class Webhooks extends Util {
	sendFirst = async (msg: Message, text: string, channel?: TextChannel, name?: string, pfp?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) channel = msg.channel;
		if (!name) name = msg.author.username;
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
		if (!webhooks.first()) {
			webhook = await channel.createWebhook('owo');
		} else webhook = webhooks.first();
		return webhook;
	};
}
