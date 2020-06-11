import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const regex = /\d{17,19}/;

	const emojis = msg.content.match(msg.client.constants.regex.emotes);

	if (!emojis || !emojis.length) return msg.client.helpers.wrongSyntax(msg, 'You did not provide any valid emojis!');

	const urls = emojis.map(e => `<https://cdn.discordapp.com/emojis/${e.match(regex)?.[0]}.${e.startsWith('<a') ? 'gif' : 'png'}>`);

	return msg.channel.send(urls.join('\n'));
};

export const command: Command = {
	aliases: ['e', 'emote'],
	description: "Get an emoji's url",
	usage: '<Emoji> (You can include as many as you want)',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
