import NekoClient from 'nekos.life';
import { NekoNsfwEndpoints, NekoSfwEndpoints } from '../../interfaces/NekoOptions';
import { TextChannel } from 'discord.js';
import { Message, Client } from '../../Client';

export default class Nekos extends NekoClient {
	client: Client;
	constructor(client: Client) {
		super();
		this.client = client;
	}

	async getImage(type: NekoSfwEndpoints) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		return (await this.sfw[type]())?.url;
	}

	async getHentai(type: NekoNsfwEndpoints) {
		return (await this.nsfw[type]())?.url;
	}

	async OwOify(text: string) {
		return (await this.sfw.OwOify({ text: text }))?.owo;
	}

	async eightball() {
		return await this.sfw['8Ball']({ text: '' });
	}

	async fact() {
		return (await this.sfw.fact()).fact;
	}

	async spoiler(text: string) {
		if (text.length >= 400) return;
		return (await this.sfw.spoiler({ text: text }))?.owo;
	}

	async sendImage(message: Message, args: string[], type: NekoSfwEndpoints, description: string) {
		let member;
		if (args.length && message.guild) {
			member = await message.client.helpers.getMember(message, args, undefined, true);
			if (!member) return;
		}

		const url = await this.getImage(type);
		if (!url) return message.client.helpers.wrongSyntax(message, 'Something went wrong and I was not able to fetch an image!');

		const output = message.client
			.newEmbed('BASIC')
			.setImage(url)
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 256, dynamic: true }));

		if (!member) return message.channel.send(output);

		output.setDescription(
			`_${description
				.replace('{{USER}}', `**${message.member!.displayName.escapeMarkdown()}**`)
				.replace('{{MEMBER}}', `**${member.displayName.escapeMarkdown()}**`)}_`
		);
		return message.channel.send(output);
	}

	async sendHentai(message: Message, type: NekoNsfwEndpoints) {
		if (!message.guild || !(message.channel as TextChannel).nsfw) return;

		const url = await this.getHentai(type);
		if (!url) return;

		const output = message.client
			.newEmbed('BASIC')
			.setImage(url)
			.setAuthor(`So naughty, ${message.author.username}~`, message.author.displayAvatarURL({ size: 256, dynamic: true }));

		return message.channel.send(output);
	}
}
