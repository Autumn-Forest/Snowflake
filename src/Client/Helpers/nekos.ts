import NekoClient from 'nekos.life';
import { NekoSfwImageOptions, NekoNsfwImageOptions } from '../../interfaces/NekoOptions';
import { TextChannel } from 'discord.js';
import { Message, Client } from '../../Client';
const neko = new NekoClient();

export class Nekos extends NekoClient {
	client: Client;
	constructor(client: Client) {
		super();
		this.client = client;
	}

	getImage = async (type: NekoSfwImageOptions) => {
		return (await neko.sfw[type]())?.url;
	};

	getHentai = async (type: NekoNsfwImageOptions) => {
		return (await neko.nsfw[type]())?.url;
	};

	OwOify = async (text: string) => {
		return (await neko.sfw.OwOify({ text: text }))?.owo;
	};

	eightball = async () => {
		return await neko.sfw['8Ball']({ text: '' });
	};

	fact = async () => {
		return (await neko.sfw.fact()).fact;
	};

	spoiler = async (text: string) => {
		if (text.length >= 400) return;
		return (await neko.sfw.spoiler({ text: text }))?.owo;
	};

	sendImage = async (message: Message, args: string[], type: NekoSfwImageOptions, description: string) => {
		let member;
		if (args.length && message.guild) {
			member = await message.client.helpers.getMember(message, args);
			if (!member) return;
		}

		const url = await this.getImage(type);
		if (!url) return; // TODO ERROR HERE

		const output = message.client
			.newEmbed('BASIC')
			.setImage(url)
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 256, dynamic: true }));

		if (!member) return message.channel.send(output);

		output.setDescription(
			`*${description
				.replace('{{USER}}', `**${message.member!.displayName.replace(/\*/g, '\\*')}**`)
				.replace('{{MEMBER}}', `**${member.displayName.replace(/\*/g, '\\*')}**`)}*`
		);
		return message.channel.send(output);
	};

	sendHentai = async (message: Message, type: NekoNsfwImageOptions) => {
		if (!message.guild || !(message.channel as TextChannel).nsfw) return;

		const url = await this.getHentai(type);
		if (!url) return;

		const output = message.client
			.newEmbed('BASIC')
			.setImage(url)
			.setAuthor(`So naughty, ${message.author.username}~`, message.author.displayAvatarURL({ size: 256, dynamic: true }));

		return message.channel.send(output);
	};
}
