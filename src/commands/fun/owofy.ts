import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const owo = await msg.client.nekos.OwOify(args.join(' '));
	if (!owo) return msg.client.helpers.wrongSyntax(msg, 'You did not use this command correctly. The correct usage is `{USAGE}`.');
	msg.delete();
	const ee = msg.client.newEmbed('BASIC').setTitle(`${msg.author.tag} said:`).setDescription(owo);
	return msg.channel.send(ee);
};

export const command: Command = {
	name: 'OwOfy',
	category: 'Fun',
	aliases: ['owo'],
	description: 'OwOfy youw text uwu',
	usage: '<text>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
