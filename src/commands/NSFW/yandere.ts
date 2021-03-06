import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	args = args.map(arg => arg.toLowerCase());
	const bannedTags = args.filter(arg => msg.client.constants.bannedTags.includes(arg));

	if (bannedTags.length)
		if (bannedTags.includes('loli') || bannedTags.includes('lolicon'))
			return msg.channel.send(msg.client.newEmbed('ERROR').setImage('https://cdn.autumn-forest.net/sfw/assets/lolice.png').setTitle('Oop! No loli :P'));
		else return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	const result = (await msg.client.helpers.fetch('https://yande.re/post.json?limit=100&tags=' + args.join('%20')))?.filter(
		(item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word))
	);
	if (!result || !result.length) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find any images matching your search term.');

	const res = result[Math.floor(Math.random() * result.length)];
	const url = res.sample_url;
	if (!url) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find any images matching your search term.');

	const output = msg.client
		.newEmbed('BASIC')
		.setImage(url)
		.setDescription(`[Source](${res.source && res.source.match(msg.client.constants.regex.links) ? res.source : `https://yande.re/post/show/${res.id}`})`)
		.setFooter(`Author: ${res.author || 'Unknown'}`)
		.setTimestamp(res.created_at);

	return msg.channel.send(output);
};

export const command: Command = {
	cooldown: 5,
	aliases: ['yan'],
	description: 'Get images from yande.re',
	usage: '<search>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: true,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
