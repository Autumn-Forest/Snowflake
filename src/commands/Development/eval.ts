import { Message, Command } from '../../Client';

const callback = async (message: Message, args: string[]) => {
    // @ts-ignore
    const [client, commands, database, msg, guild, channel] = [
        message.client,
        message.client.commands,
        message.client.database,
        message,
        message.guild,
        message.channel
    ];

    try {
        let output = await eval(args.join(' '));

        if (typeof output !== 'string') output = require('util').inspect(output);
        if (output.length > 2000) return message.channel.send(await client.helpers.util.uploadHaste(output));

        return message.channel.send(output, { code: 'xl' });
    } catch (err) {
        return message.channel.send(err, { code: 'xl' });
    }
};

export const command: Command = {
    name: 'eval',
    category: 'DEVELOPMENT',
    aliases: [],
    usage: '',
    devOnly: true,
    nsfw: false,
    guildOnly: false,
    args: 1,
    memberPermission: [],
    botPermission: [],
    callback: callback
};
