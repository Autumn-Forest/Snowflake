import { Message, Client } from '..';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PermissionString, GuildMember } from 'discord.js';
import ordinal from 'ordinal';

export class Util {
	constructor(client: Client) {
		this.client = client;
	}
	client: Client;

	async wrongSyntax(message: Message, text: string, del = false) {
		const msg = await message.reply(text);
		if (!msg.guild || !del) return;

		msg.delete({ timeout: 1000 * 10 }).catch(() => null);
		message.delete({ timeout: 1000 * 10 }).catch(() => null);
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
		const result = await this.fetch('https://hasteb.in/documents', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: text,
			redirect: 'follow'
		});
		return result?.key ? `https://hasteb.in/${result.key}` : 'Failed to upload to hastebin!';
	}

	async isNSFW(message: Message) {
		if (message.channel.type !== 'text') return false;

		const settings = await this.client.cache.getGuild(message);
		return settings?.settings.nsfw === true && message.channel.nsfw;
	}

	missingPermissions(message: Message, permissions: PermissionString[], member?: GuildMember | 'self') {
		if (message.channel.type === 'dm') return;
		const targetMember = member === 'self' ? message.guild!.me! : member || message.member!;
		const allPermissions = message.channel.permissionsFor(targetMember) || targetMember.permissions;
		const missing = permissions.filter(p => !allPermissions?.has(p));
		return missing.length ? missing : undefined;
	}

	nicerPermissions(perm: PermissionString) {
		return perm
			.split('_')
			.map(word => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	}

	numToOrdinal(num: number) {
		return ordinal(num);
	}

	numToMonth(num: number) {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
	}
}
