import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	args = args.map(arg => arg.toLowerCase());
	const bannedTags = args.filter(arg => msg.client.constants.bannedTags.includes(arg));

	if (bannedTags.length)
		return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	if (!args[0]) {
		const file = (
			await msg.client.helpers.fetch(
				`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=100&tags=sort:random&json=1${msg.client.config.gelbooruAPI}`
			)
		)?.filter((item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word)));
		const res = file[Math.floor(Math.random() * file.length)];
		const e = msg.client
			.newEmbed('BASIC')
			.setTitle('gelbooru')
			.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${res.id}`)
			.setImage(res.file_url);
		return msg.channel.send(e);
	} else {
		const arg = args.join('+');
		let errorc = 0;
		const file = (
			await msg.client.helpers
				.fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=sort:random+${arg}&json=1${msg.client.config.gelbooruAPI}`)
				.catch(() => {
					errorc++;
				})
		)?.filter((item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word)));
		if (errorc < 1) {
			const res = file[Math.floor(Math.random() * file.length)];
			const e = msg.client
				.newEmbed('BASIC')
				.setTitle(arg.replace('+', ' '))
				.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${res.id}`)
				.setImage(res.file_url);
			return msg.channel.send(e);
		} else return msg.client.helpers.wrongSyntax(msg, "oop, one of your tags/combination of them surely don't exist!\nOr an error happened :/");
	}
};

export const command: Command = {
	name: 'gelbooru',
	category: 'NSFW',
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
