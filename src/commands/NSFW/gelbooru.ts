import { Command, Message } from '../../Client';
import nodeFetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	const baseReq = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&api_key=${msg.client.config.apiKeys.gelbooru.key}&user_id=${msg.client.config.apiKeys.gelbooru.id}&tags=sort:random+`;
	const baseView = `https://gelbooru.com/index.php?page=post&s=view&id=`;

	args = args.map(arg => arg.toLowerCase());
	const bannedTags = args.filter(arg => msg.client.constants.bannedTags.includes(arg));

	if (bannedTags.length)
		if (bannedTags.includes('loli') || bannedTags.includes('lolicon'))
			return msg.channel.send(msg.client.newEmbed('ERROR').setImage('https://cdn.autumn-forest.net/sfw/assets/lolice.png').setTitle('Oop! No loli :P'));
		else return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	const output = msg.client.newEmbed('BASIC').setTitle('gelbooru');

	const file = (await fetch(baseReq + (args.length ? args.join('+') : '&limit=100')))?.filter(
		(item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word))
	);

	if (!file || !file.length) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find any images matching your search terms.');

	const res = file[Math.floor(Math.random() * file.length)];

	return msg.channel.send(output.setURL(`${baseView}${res.id}`).setImage(res.file_url));
};

const fetch = async (url: string) =>
	await nodeFetch(url)
		.then(res => res.json())
		.catch(() => null);

export const command: Command = {
	cooldown: 5,
	aliases: ['gelb'],
	description: 'Search randomly a content on gelbooru (with tags or not)',
	usage: '[tag(s)]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: true,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
