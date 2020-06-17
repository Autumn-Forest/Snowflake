import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	msg.client.pagination.add(
		msg,
		[1, 2, 3].map(n => msg.client.newEmbed('BASIC').setDescription(n))
	);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	args: 0,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
