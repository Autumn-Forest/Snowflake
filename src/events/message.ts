import { Client, Message } from '../Client';
import { stripIndents } from 'common-tags';

export const listener = async (client: Client, message: Message) => {
	if (message.author.bot) return;

	if (message.partial) message = (await message.fetch().catch(() => null)) as Message;
	if (!message) return;

	const guildPrefix = await client.getPrefix(message);
	const guildPrefixes = await client.getPrefixes(message);
	const userPrefixes = await client.getUserPrefixes(message.author);

	let prefixes = [guildPrefix];
	if (guildPrefixes) prefixes = prefixes.concat(guildPrefixes);
	if (userPrefixes) prefixes = prefixes.concat(userPrefixes);

	const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${prefixes.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*`);

	const matched = message.content.match(prefixRegex);
	const prefix = matched ? matched[0] : null;
	if (!prefix || !message.content.startsWith(prefix)) return;

	if (!message.content.replace(new RegExp(`<@!?${client.user!.id}>`), '').length)
		return message.channel.send(stripIndents`
		My prefix is \`${guildPrefix}\`
		For a list of commands, type \`${guildPrefix}help\``);

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift();
	if (!commandName) return;

	const command = client.getCommand(commandName);
	if (!command) return;

	if (!message.content.endsWith('--force') || !message.client.config.developers.includes(message.author.id)) {
		if (command.devOnly && !message.client.config.developers.includes(message.author.id)) return;

		if (command.guildOnly && !message.guild)
			return message.client.helpers.wrongSyntax(message, `\`${prefix}${command.name}\` can only be used on a server!`);

		if (command.nsfw && !message.client.helpers.isNSFW(message))
			return message.client.helpers.wrongSyntax(message, `\`${prefix}${command.name}\` can only be used in a NSFW channel!`);

		if (command.memberPermission.length && message.client.helpers.missingPermissions(message, command.memberPermission))
			return message.client.helpers.wrongSyntax(
				message,
				`You require the following permissions to use this command: ${message.client.helpers
					.missingPermissions(message, command.memberPermission)!
					.map(perm => message.client.helpers.nicerPermissions(perm))
					.join(', ')}`
			);
		if (command.botPermission.length && message.client.helpers.missingPermissions(message, command.botPermission, 'self'))
			return message.client.helpers.wrongSyntax(
				message,
				`I require the following permissions to run this command: ${message.client.helpers
					.missingPermissions(message, command.botPermission, 'self')!
					.map(perm => message.client.helpers.nicerPermissions(perm))
					.join(', ')}`
			);

		if (args.length < command.args)
			return message.client.helpers.wrongSyntax(
				message,
				`This command requires ${command.args} arguments, but you only provided ${args.length}.\nPlease use it like this: \`${prefix}${command.name} ${command.usage}\``
			);
	}

	command
		.callback(message, args)
		//@ts-ignore
		.then(() => client.emit('commandUsed', message, command))
		.catch(err => client.handleError(err, message));
	return;
};
