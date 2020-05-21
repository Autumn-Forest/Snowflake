import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const prompt = new msg.client.prompt(msg);

	const name = await prompt.message("What's your name?", /^\w+$/i);
	if (!name) return;
	const age = await prompt.message('How old are you?', /^\d{2}$/, 'Please provide a number from 10-99!');
	if (!age) return;
	const emoji = await prompt.reaction('Please react with an emoji of choice', ['✅', '❌'], true, 'Please react with one of the provided reactions!');
	if (!emoji) return;

	prompt.delete();

	return msg.channel.send(`Name: ${name}\nAge: ${age}\nEmoji: ${emoji.name}`);
};

export const command: Command = {
	name: 'prompt',
	category: 'Dev',
	aliases: [],
	description: '',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
