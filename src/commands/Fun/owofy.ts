import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const owo = await msg.client.nekos.OwOify(args.join(' '));
	if (!owo) return msg.client.helpers.wrongSyntax(msg, `You did not use this command correctly. The correct usage is ${command.usage}.`, true);
	msg.delete().catch(() => null);
	return msg.client.webhooks.sendFirst(msg, owo);
};

export const command: Command = {
	name: 'owofy',
	category: 'Fun',
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
