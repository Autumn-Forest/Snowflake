import { Command, Message } from '../../Client';
import { Collection } from 'discord.js';

const callback = async (msg: Message, _args: string[]) => {
	msg.client.commands = new Collection();
	msg.client.initCommands();
	msg.client.removeAllListeners();
	msg.client.initListeners();
	return msg.channel.send(`Successfully reloaded all commands and listeners! There are ${msg.client.commands.size} commands.`);
};

export const command: Command = {
	aliases: [],
	description: 'Reload the commands and listeners',
	usage: '',
	args: 0,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
