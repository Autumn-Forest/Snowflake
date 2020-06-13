import { Command, Message } from '../../Client';
import { PromptManager } from '../../Client/Helpers';

const callback = async (message: Message, _args: string[]): Promise<void | Message> => {
	const e = message.client.constants.emojis;

	const prompt = new PromptManager(message);
	const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXY'.split('');
	const letEmojis = alph.map(l => `<:letterTeal${l}:${e[('letterTeal' + l) as keyof typeof e]}>`);
	const letEmojiIds = alph.map(l => e[('letterTeal' + l) as keyof typeof e]);

	const pollType = await prompt.chooseOne('What kind of poll would you like to make?', ['Yes / No', 'Multiple Options']);
	if (!pollType) return;

	const question = await prompt.message('What topic/question would you like to poll?', /.*/);

	if (!question) return;

	if (pollType === 'Yes / No') {
		prompt.delete();

		const msg = await message.channel.send(message.client.newEmbed('BASIC').setTitle(question));

		await msg.react(message.client.constants.emojis.upvote);
		await msg.react(message.client.constants.emojis.downvote);

		return;
	}

	let amount: string | number | void = await prompt.message('How many options would you like to have? (MAX: 20)', /^([01]?[0-9]|20)$/);
	if (!amount || !parseInt(amount)) return;

	amount = parseInt(amount);

	const options: string[] = [];

	while (options.length < amount) {
		const opt = await prompt.message(`What would you like question #${options.length + 1} to be?`, /.*/);
		if (!opt) return;

		options.push(opt);
	}

	prompt.delete();

	const optsStrings = options.map((opt, i) => `${letEmojis[i]} - ${opt}`);

	const msg = await message.channel.send(message.client.newEmbed('BASIC').setTitle(question).setDescription(optsStrings.join('\n\n')));

	const e1 = options.map((_opt, i) => letEmojiIds[i]);

	await Promise.all(e1.map(a => msg.react(a).catch(() => null)));

	return;
};

export const command: Command = {
	aliases: ['p'],
	description: 'Creates a poll and reacts to it with the corresponding emojis.',
	args: 0,
	usage: '',
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: ['MANAGE_MESSAGES', 'ADD_REACTIONS'],
	botPermission: ['ADD_REACTIONS', 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'],
	callback: callback
};
