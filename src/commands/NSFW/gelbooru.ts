import { Command, Message } from '../../Client';
import nodeFetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	args = args.map(arg => arg.toLowerCase());
	const bannedTags = args.filter(arg => msg.client.constants.bannedTags.includes(arg));

	if (bannedTags.length)
		return msg.client.helpers.wrongSyntax(msg, `One or more of the provided tags are blacklisted as they break Discord ToS: ${bannedTags.join(', ')}`);

	if (!args.length) {
		const file = (
			await msg.client.helpers.fetch(
				`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=100&tags=sort:random&json=1${msg.client.config.gelbooruAPI}`
			)
		)?.filter((item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word)));
		const res = file[Math.floor(Math.random() * file.length)];
		if (!res) return msg.client.helpers.wrongSyntax(msg, 'No result! An error may happened or gelbooru is down OwO');
		const e = msg.client
			.newEmbed('BASIC')
			.setTitle('gelbooru')
			.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${res.id}`)
			.setImage(res.file_url);
		return msg.channel.send(e);
	} else {
		const arg = args.join('+');
		let error = 0; // due to how gelb work, i didn't find other solution than increments a value when a error is catched with fetch.
		let file = await nodeFetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=sort:random+${arg}&json=1${msg.client.config.gelbooruAPI}`)
			.then(response => response.json())
			.catch(() => {
				error++; // increase on errors
				msg.client.helpers.wrongSyntax(msg, "oop, one of your tags/combination of them surely don't exist!\nOr an error happened :/"); // return if an error got catched.
			});
		if (error !== 0) return; // return if an error hapened (i can't return directly in catch :/ )
		file = file.filter((item: { [key: string]: string }) => !msg.client.constants.bannedTags.some(word => item.tags.includes(word)));
		const res = file[Math.floor(Math.random() * file.length)];
		if (!res) return msg.client.helpers.wrongSyntax(msg, "oop, one of your tags/combination of them surely don't exist!\nOr an error happened :/");
		const e = msg.client
			.newEmbed('BASIC')
			.setTitle(arg.replace('+', ' '))
			.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${res.id}`)
			.setImage(res.file_url);
		return msg.channel.send(e);
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
