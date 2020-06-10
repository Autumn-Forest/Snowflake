import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.guild) return;

	const emotes = args
		.join(' ')
		.match(msg.client.constants.regex.emotes)
		?.map(e => {
			const match = e.match(/<a?:(\w+):(\d+)>/);
			if (!match) return null;
			return { name: match[1], id: match[2], animated: e.startsWith('<a') };
		})
		.filter(e => !!e && !!e.name && !!e.id);
	if (!emotes || !emotes.length) return msg.client.helpers.wrongSyntax(msg, 'You did not provide any valid emotes!');

	const m = await msg.channel.send(msg.client.constants.emojis.loading);

	const created = (
		await Promise.all(
			emotes.map(e => msg.guild!.emojis.create(`https://cdn.discordapp.com/emojis/${e!.id}.${e!.animated ? 'gif' : 'png'}`, e!.name).catch(() => null))
		).catch(() => null)
	)?.filter(e => !!e);

	if (!created || !created.length)
		return m.edit(
			msg.client.constants.emojis.fail + ' I was unable to yoink the emotes. This is most likely because this server does not have any emote slots!'
		);
	else m.edit(`${msg.client.constants.emojis.success} Successfully yoinked ${created.length} emotes: ${created.join(' ')}`);
};

export const command: Command = {
	name: 'yoink',
	category: 'Utility',
	aliases: ['yoinkemotes', 'yoinkemojis'],
	description: 'Upload emotes from another server to yours',
	usage: '<Emotes>',
	args: 1,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_EMOJIS'],
	botPermission: ['MANAGE_EMOJIS'],
	callback: callback
};
