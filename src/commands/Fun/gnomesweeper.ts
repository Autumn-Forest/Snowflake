import { Command, Message } from '../../Client';
import Minesweeper from 'discord.js-minesweeper';

const callback = async (msg: Message, args: string[]) => {
	const [cols, rows, mines] = args.map(x => parseInt(x));

	let game = new Minesweeper({
		columns: cols || 10,
		rows: rows || 10,
		mines: mines || 10,
		revealFirstCell: true
	}).start();

	if (!game) return;
	game = `${mines || 10} Gnomes <:GnomePeek:719723961503449088>\n${(game as string).replace(/:boom:/g, '<:gnome:719724000103628820>')}`;
	if (game.length > 2000) return msg.client.helpers.wrongSyntax(msg, 'Sorry, but the board you selected was too long! Please try a smaller one');

	return msg.channel.send(game);
};

export const command: Command = {
	name: 'gnomesweeper',
	category: 'Fun',
	aliases: ['gnomes', 'minesweeper', 'mines', 'gs'],
	description: 'Play a game of gnomesweeper©️',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
