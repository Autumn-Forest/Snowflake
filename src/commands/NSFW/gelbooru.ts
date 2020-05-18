import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!args[0]) {
		const file = await msg.client.helpers
			.fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=1&tags=sort:random&json=1${msg.client.config.gelbooruAPI}`)
			.then(response => response.json());
		const e = msg.client
			.newEmbed('BASIC')
			.setTitle('gelbooru')
			.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${file['0'].id}`)
			.setImage(file[0].file_url);
		return msg.channel.send(e);
	} else {
		const arg = args.join('+');
		let errorc = 0;
		const file = await msg.client.helpers
			.fetch(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=1&tags=sort:random+${arg}&json=1${msg.client.config.gelbooruAPI}`)
			.then(response => response.json())
			.catch(() => {
				errorc++;
			});
		if (errorc < 1) {
			const e = msg.client
				.newEmbed('BASIC')
				.setTitle(arg.replace('+', ' '))
				.setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${file['0'].id}`)
				.setImage(file[0].file_url);
			return msg.channel.send(e);
		} else return msg.channel.send("oop, one of your tags/combination of them surely don't exist!\nOr an error happened :/");
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
