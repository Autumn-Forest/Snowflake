import { Command, Message } from '../../Client';

const callback = async (message: Message, _args: string[]) => {
	return message.channel.send(`https://discordapp.com/oauth2/authorize?client_id=${message.client.user!.id}&permissions=1580592383&scope=bot`);
};

export const command: Command = {
	name: 'invite',
	category: 'Utility',
	aliases: ['inv'],
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
