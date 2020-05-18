import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const arg = args.join(' ').replace(msg.client.constants.emoteRegex, '');
	const spoiled = await msg.client.nekos.spoiler(arg);
	if (!spoiled) return msg.client.helpers.wrongSyntax(msg, `You did not use this command correctly. The correct usage is ${command.usage}.`, true);
	msg.delete().catch(() => null);
	return msg.client.webhooks.sendFirst(msg, spoiled);
};

export const command: Command = {
	name: 'spoiler',
	category: 'Fun',
	aliases: ['spoilers'],
	description: 'Transform your boring text into some beautifull spoiled text :P',
	usage: '<text:1-400>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['MANAGE_WEBHOOKS'],
	callback: callback
};
