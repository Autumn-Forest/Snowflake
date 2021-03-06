import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const owo = await msg.client.nekos.OwOify(args.join(' '));
	if (!owo) return msg.client.helpers.wrongSyntax(msg, `"Your message could not be owofied. Please try again."`);
	msg.delete().catch(() => null);
	return msg.client.webhooks.sendFirst(msg, owo);
};

export const command: Command = {
	aliases: ['owo'],
	description: 'OwOfy youw text uwu',
	usage: '<text>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['MANAGE_WEBHOOKS'],
	callback: callback
};
