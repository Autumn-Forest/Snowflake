import { Message } from '../../Client';
import { Util } from './util';
import { TextChannel } from 'discord.js';
export class Webhooks extends Util {
	sendFirst = async (msg: Message, text: string, channel?: TextChannel, name?: string, pfp?: string) => {
		if (msg.channel.type !== 'text') return;
		if (!channel) channel = msg.channel;
		if (!name) name = msg.author.username;
		if (!pfp) pfp = msg.author.displayAvatarURL();

		const webhook = (await this.fetchFirst(channel)).first();
		return webhook?.send(text, {
			username: name,
			avatarURL: pfp
		});
	};

	fetchFirst = async (channel: TextChannel) => {
		let webhooks = await channel.fetchWebhooks();
		if (!webhooks.first()) {
			await channel.createWebhook('owo');
			webhooks = await channel.fetchWebhooks();
		}
		return webhooks;
	};
}
