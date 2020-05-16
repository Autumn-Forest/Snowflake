import { Message, Command } from '../../Client';

const callback = async (message: Message, _args: string[]) => {
    await message.channel.send('Okay, shutting down!');
    process.exit();
};

export const command: Command = {
    name: 'shutdown',
    category: 'Dev',
    aliases: ['exit', 'goodnight'],
    usage: '',
    devOnly: true,
    nsfw: false,
    guildOnly: false,
    args: 0,
    memberPermission: [],
    botPermission: [],
    callback: callback
};
