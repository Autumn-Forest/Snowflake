import { Message } from '..';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';
import { BaseClass } from '.';

export class Util extends BaseClass {
	async wrongSyntax(message: Message, del = false) {
		const msg = await message.reply('text');
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
}
