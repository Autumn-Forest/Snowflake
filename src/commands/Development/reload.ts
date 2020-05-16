import { Command, Message } from '../../Client';
import { Collection } from 'discord.js';

const callback = async (message: Message, _args: string[]) => {
    message.client.commands = new Collection();
    message.client.initCommands();
    message.client.removeAllListeners();
    message.client.initListeners();
    return message.channel.send(`Successfully reloaded all commands and listeners! There is ${message.client.commands.size} Commands.`);
};

export const command: Command = {
    name: 'reload',
    category: 'Dev',
    aliases: [],
    usage: '',
    args: 0,
    devOnly: true,
    guildOnly: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    callback: callback
};
