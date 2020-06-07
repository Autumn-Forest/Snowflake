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
		const s = await message.client.cache.getGuild(message);
		if (s?.settings.deleteFailedCommands) {
			msg.delete({ timeout: 1000 * 10 }).catch(() => null);
			message.delete({ timeout: 1000 * 10 }).catch(() => null);
		}
	}

	codeBlock(str: string, lang = 'js') {
		return '```' + `${lang || ''}\n${str}` + '```';
	}

	trimString(str: string, len = 2000) {
		return str.length > len ? str.slice(0, len - 3) + '...' : str;
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

	titleCase(str: PermissionString): string;
	titleCase(str: PermissionString[]): string[];
	titleCase(str: string): string;
	titleCase(str: string[]): string[];
	titleCase(str: string | string[]) {
		const transformWord = (word: string) =>
			word
				.split('_')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
		return Array.isArray(str) ? str.map(w => transformWord(w)) : transformWord(str);
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
}
