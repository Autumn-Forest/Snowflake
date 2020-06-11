import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.guild) return;

	const d = msg.guild.createdAt;
	return msg.channel.send(`${d.formatDate()} at ${d.formatTime()} ~ ${d.age()} ago`);
};

export const command: Command = {
	aliases: ['guildage'],
	description: "Check the server's age",
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
