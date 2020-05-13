import { Client, Message } from '../Client';

export const listener = async (client: Client, message: Message) => {
    if (message.author.bot) return;

    if (message.partial) message = (await message.fetch()) as Message;

    const guildPrefix = await client.getPrefix(message);
    const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${guildPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const matched = message.content.match(prefixRegex);
    const prefix = matched ? matched[0] : null;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    if (!commandName) return;

    const command = client.getCommand(commandName);
    if (!command) return;

    command
        .callback(message, args)
        //@ts-ignore
        .then(() => client.emit('commandUsed', message, command))
        .catch(err => client.handleError(err, message));
};
