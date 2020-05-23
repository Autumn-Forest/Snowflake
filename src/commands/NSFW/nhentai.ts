import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const nhentai = new msg.client.nhentai(args.join('%20'));
	await nhentai.fetch();

	const m = await msg.channel.send({ embed: nhentai.nextPage });
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
	name: 'nhentai',
	category: 'NSFW',
	aliases: ['hentai', 'nh'],
	description: 'Get hentai from nhentai.net',
	usage: '<ID/Tags/Name>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: true,
	memberPermission: [],
	botPermission: [],
	callback: callback
};