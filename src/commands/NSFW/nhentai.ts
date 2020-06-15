import { Command, Message } from '../../Client';
import fetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	let query = args.join('%20');
	if (!query) {
		const random = (await fetch('https://nhentai.net/random')).url.match(/\d+/);
		if (!random) return;
		query = random[0];
	}
	const nhentai = new msg.client.nhentai(query);
	await nhentai.fetch();

	if (!nhentai.exists) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find a doujin matching your search term.');

	const m = await msg.channel.send({ embed: nhentai.embed });
	await Promise.all(['⬅️', '⏹️', '➡️'].map(e => m.react(e)));
	const menu = m.createReactionCollector((_r, u) => u.id === msg.author.id);

	let stopped = false;
	menu.on('collect', async e => {
		e.users.remove(msg.author);

		if (e.emoji.name === '➡️') {
			const page = nhentai.nextPage;
			if (!page) return;
			m.edit({ embed: page });
		} else if (e.emoji.name === '⬅️') {
			const page = nhentai.previousPage;
			if (!page) return;
			m.edit({ embed: page });
		} else if (e.emoji.name === '⏹️') {
			m.reactions.removeAll();
			stopped = true;
			menu.stop();
		}
	});

	menu.on('end', () => {
		return msg.channel.send(stopped ? 'Successfully closed the menu!' : 'The menu timed out!');
	});
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
