import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	args = args.map(arg => arg.toLowerCase());
	const bannedTags = args.filter(arg => ['loli', 'shota'].includes(arg));

	if (bannedTags.length)
		return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	const result = (await msg.client.helpers.fetch('https://yande.re/post.json?limit=100&tags=' + args.join('%20')))?.filter(
		(item: { [key: string]: string }) => !item.tags.includes('loli') && !item.tags.includes('shota')
	);
	if (!result || !result.length) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find any images matching your search terms.');

	const res = result[Math.floor(Math.random() * result.length)];
	const url = res.sample_url;
	if (!url) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find any images matching your search terms.');

	const output = msg.client
		.newEmbed('BASIC')
		.setImage(url)
		.setDescription(`[Source](${msg.client.constants.regex.links.test(res.source) ? res.source : `https://yande.re/post/show/${res.id}`})`)
		.setFooter(`Author: ${res.author || 'Unknown'}`)
		.setTimestamp(res.created_at);

	return msg.channel.send(output);
};

export const command: Command = {
	name: 'yandere',
	category: 'NSFW',
	aliases: ['yan'],
	description: 'Get images from yande.re',
	usage: '<search>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: true,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
