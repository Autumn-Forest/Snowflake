import { Message, Client } from '..';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PermissionString, GuildMember, Message as BaseMessage, GuildChannel } from 'discord.js';
import { GuildMessage } from '../../interfaces/GuildMessage';

export default class Util {
	constructor(client: Client) {
		this.client = client;
	}
	client: Client;

	async wrongSyntax(message: Message, text: string) {
		const msg = await message.reply(text);
		if (!msg.guild) return;
		const settings = await message.client.cache.getGuild(message);
		if (settings?.settings.deleteFailedCommands) {
			msg.delete({ timeout: 1000 * 10 }).catch(() => null);
			message.delete({ timeout: 1000 * 10 }).catch(() => null);
		}
	}

	async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(requestInfo, requestOptions)
				.then(async res => {
					if (res.status > 299 || res.status < 200) reject(`${res.status} | ${res.statusText}`);

					try {
						const contentType = res.headers.get('content-type') || 'application/json';

						let result;
						if (contentType.includes('image')) result = await res.buffer();
						else if (contentType.includes('text')) result = await res.text();
						else result = await res.json();
						resolve(result);
					} catch (error) {
						reject(error);
					}
				})
				.catch(reject);
		});
	}

	async uploadHaste(text: string) {
		const init: RequestInit = {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: text,
				redirect: 'follow',
				timeout: 3000
			},
			urls = ['https://hasteb.in/', 'https://hastebin.com/'];
		let url: string | null = urls[0];

		const res =
			(await this.fetch(url + 'documents', init).catch(() => {
				url = urls[1];
				return null;
			})) ||
			(await this.fetch(url + 'documents', init).catch(() => {
				url = null;
				return null;
			}));

		return url && res && res.key ? url + res.key : 'Failed to upload to hastebin';
	}

	async isNSFW(message: Message) {
		if (message.channel.type !== 'text') return false;

		const settings = await this.client.cache.getGuild(message);
		return settings?.settings.nsfw && message.channel.nsfw;
	}

	missingPermissions(identifier: Message | GuildChannel, permissions: PermissionString[], member?: GuildMember | 'self') {
		const author = identifier instanceof BaseMessage ? identifier.member! : null;
		if (identifier instanceof BaseMessage) {
			if (identifier.channel instanceof GuildChannel) identifier = identifier.channel;
			else return;
		}
		const targetMember = member === 'self' ? identifier.guild.me! : member || author || identifier.guild.me!;
		const allPermissions = identifier.permissionsFor(targetMember) || targetMember.permissions;
		const missing = permissions.filter(p => !allPermissions?.has(p));
		return missing.length ? missing : undefined;
	}

	numToMonth(num: number) {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
	}

	isImageUrl(str: string) {
		return this.client.constants.regex.links.test(str) && str.match(/.(png|jpe?g|gif|web[pm])(?:\?.*)?$/i) !== null;
	}
	msToHuman(ms: number) {
		const seconds = Math.round(ms / 1000),
			minutes = Math.round(ms / (1000 * 60)),
			hours = Math.round(ms / (1000 * 60 * 60)),
			days = Math.round(ms / (1000 * 60 * 60 * 24));

		if (seconds < 60) return seconds + ' Seconds';
		else if (minutes < 60) return minutes + ' Minutes';
		else if (hours < 24) return hours + ' Hours';
		else return days + ' Days';
	}

	isGuild(msg: Message | BaseMessage): msg is GuildMessage {
		return !!msg.guild;
	}

	isMemberHigher(executor: GuildMember, target: GuildMember) {
		return (
			(executor.id !== target.id && executor.guild.ownerID === executor.id) ||
			(target.guild.ownerID !== target.id && executor.roles.highest.position > target.roles.highest.position)
		);
	}
}
