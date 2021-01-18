import { Command, Message } from '../../Client';
import fetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	let bannedTags = args.filter(arg => msg.client.constants.bannedTags.some(tag => tag.toLowerCase() === arg.toLowerCase()));
	if (bannedTags.length)
		if (bannedTags.includes('loli') || bannedTags.includes('lolicon'))
			return msg.channel.send(msg.client.newEmbed('ERROR').setImage('https://naia-love.neocities.org/images/lolice.png').setTitle('Oop! No loli :P'));
		else return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	let query = args.join('%20');
	if (!query) {
		const random = (await fetch('https://nhentai.net/random')).url.match(/\d+/);
		if (!random) return msg.client.helpers.wrongSyntax(msg, `An error happened!`);
		query = random[0];
	}
	let hentai = await msg.client.helpers
		.fetch('https://nhentai.net/api/' + (parseInt(query) ? `gallery/${query}` : `galleries/search?query=${query.replace(/ +/, '%20')}`))
		.catch(() => null);

	if (!hentai || hentai.error) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find a doujin matching your search term. Or an error happened.');

	if (hentai.result) hentai = hentai.result.length ? hentai.result.random() : null;
	if (!hentai || !hentai.id) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find a doujin matching your search term.');

	bannedTags = hentai.tags.map((tag: Record<string, string>) => tag.name).filter((arg: string) => msg.client.constants.bannedTags.includes(arg));

	if (bannedTags.length) {
		if (parseInt(args[0])) {
			return msg.client.helpers.wrongSyntax(msg, `The provided doujin contain blacklisted tags: ${bannedTags.join(', ')}`);
		}

		for (let i = 0; i < 5; i++) {
			if (!args) {
				const random = (await fetch('https://nhentai.net/random')).url.match(/\d+/);
				if (!random) return msg.client.helpers.wrongSyntax(msg, `An error happened!`);
				query = random[0];
			}

			hentai = await msg.client.helpers
				.fetch('https://nhentai.net/api/' + (parseInt(query) ? `gallery/${query}` : `galleries/search?query=${query.replace(/ +/, '%20')}`))
				.catch(() => null);

			if (!hentai || hentai.error)
				return msg.client.helpers.wrongSyntax(msg, 'I was not able to find a doujin matching your search term. Or an error happened');

			if (hentai.result) hentai = hentai.result.length ? hentai.result.random() : null;

			if (!hentai || !hentai.id) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find a doujin matching your search term.');
			bannedTags = hentai.tags.map((tag: Record<string, string>) => tag.name).filter((arg: string) => msg.client.constants.bannedTags.includes(arg));

			if (!bannedTags.length) {
				i = 11;
				return;
			}
		}
		if (bannedTags.length)
			return msg.client.helpers.wrongSyntax(msg, `I could only fetch doujin with blacklisted tags, maybe try again or change your combination of tags.`);
	}

	const embed = msg.client
		.newEmbed('INFO')
		.setTitle(hentai.title.pretty || hentai.title.english || hentai.title.japanese)
		.setURL(`https://nhentai.net/g/${hentai.id}`)
		.setDescription(hentai.tags.map((tag: Record<string, string>) => tag.name).join(', '))
		.setImage('https://t.nhentai.net/galleries/{MEDIA_ID}/cover.jpg'.substitute({ MEDIA_ID: hentai.media_id }));

	const pages = [embed];
	for (let i = 1; i < hentai.num_pages; i++) {
		pages.push(
			msg.client
				.newEmbed('BASIC')
				.setTitle(hentai.title.pretty || hentai.title.english || hentai.title.japanese)
				.setURL(`https://nhentai.net/g/${hentai.id}`)
				.setImage('https://i.nhentai.net/galleries/{MEDIA_ID}/{PAGE}.jpg'.substitute({ MEDIA_ID: hentai.media_id, PAGE: i.toString() }))
				.setDescription('')
		);
	}
	msg.client.pagination.create(msg, pages, 0);
};

export const command: Command = {
	cooldown: 10,
	aliases: ['hentai', 'nh'],
	description: 'Get hentai from nhentai.net',
	usage: '<ID/Tags/Name>',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: true,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
