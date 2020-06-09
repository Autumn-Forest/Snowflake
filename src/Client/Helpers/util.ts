import { Message, Client } from '..';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PermissionString, GuildMember, Message as BaseMessage, GuildChannel } from 'discord.js';
import ordinal from 'ordinal';

export class Util {
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

	async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit) {
		const result = await nodeFetch(requestInfo, requestOptions)
			.then(response => {
				return response.json().then(json => {
					return response.ok ? json : Promise.reject(json);
				});
			})
			.catch(this.client.handleError);
		return result;
	}

	async uploadHaste(text: string) {
		let url = 'https://hastebin.com/';

		let result = await this.fetch(url + 'documents', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: text,
			redirect: 'follow'
		}).catch(() => null);

		if (!result || !result.key) {
			url = 'https://hasteb.in/';
			result = await this.fetch(url + 'documents', {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: text,
				redirect: 'follow'
			}).catch(() => null);
		}

		return result?.key ? url + result.key : 'Failed uploading to hastebin!';
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

	numToOrdinal(num: number) {
		return ordinal(num);
	}

	numToMonth(num: number) {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
	}

	nicerDates(date: Date | number = new Date()) {
		if (!(date instanceof Date)) date = new Date(date);
		return `${this.numToMonth(date.getMonth())} ${ordinal(date.getDate())} ${date.getFullYear()}`;
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
}
