import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length ? await msg.client.helpers.getUser(msg, args) : msg.author;
	if (!user) return;

	const d = user.createdAt;
	return msg.channel.send(`${d.formatDate()} at ${d.formatTime()} ~ ${d.age()} ago`);
};

export const command: Command = {
	name: 'userage',
	category: 'Utility',
	aliases: ['accountage', 'creationdate', 'createdat', 'howold', 'age'],
	description: 'Check a users account age',
	usage: '[User]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
