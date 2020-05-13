import { Command, Message } from '../../Client';

const callback = async (message: Message, _args: string[]) => {
    const msg = await message.channel.send('Pinging...');
    return msg.edit(`Pong! Took \`${msg.createdTimestamp - message.createdTimestamp}ms\`.`);
};

export const command: Command = {
    name: 'ping',
    category: 'Utility',
    aliases: ['p', 'heartbeat', 'ms'],
    devOnly: false,
    guildOnly: false,
    nsfw: false,
    args: 0,
    memberPermission: [],
    botPermission: [],
    callback: callback
};
