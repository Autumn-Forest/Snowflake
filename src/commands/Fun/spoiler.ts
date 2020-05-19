import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const arg = args.join(' ').replace(msg.client.constants.regex.emotes, '');
	const spoiled = await msg.client.nekos.spoiler(arg);
	if (!spoiled) return msg.client.helpers.wrongSyntax(msg, `"Your message could not be spoilified. Please try again."`);
	msg.delete().catch(() => null);
	return msg.client.webhooks.sendFirst(msg, spoiled);
};

export const command: Command = {
	name: 'spoiler',
	category: 'Fun',
	aliases: ['spoilers'],
	description: 'Spoilify your text',
	usage: '<text>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['MANAGE_WEBHOOKS'],
	callback: callback
};
