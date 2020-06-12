import { Client, Message } from '../Client';
import { stripIndents } from 'common-tags';

export const listener = async (client: Client, msg: Message) => {
	if (msg.author.bot) return;

	if (msg.partial) msg = (await msg.fetch().catch(() => null)) as Message;
	if (!msg) return;

	if (msg.client.helpers.missingPermissions(msg, ['SEND_MESSAGES', 'VIEW_CHANNEL'], 'self')) return;

	const guildPrefix = await client.getPrefix(msg);
	const guildPrefixes = await client.getPrefixes(msg);
	const userPrefixes = await client.getUserPrefixes(msg.author);

	let prefixes = [guildPrefix];
	if (guildPrefixes) prefixes = prefixes.concat(guildPrefixes);
	if (userPrefixes) prefixes = prefixes.concat(userPrefixes);
	if (!msg.guild) prefixes.push('');

	const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${prefixes.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*`);

	const matched = msg.content.match(prefixRegex);
	const prefix = matched?.[0] || null;
	if ((!prefix && msg.guild) || (prefix && !msg.content.startsWith(prefix))) return;

	if (!msg.content.replace(new RegExp(`<@!?${client.user!.id}>`), '').length)
		return msg.channel.send(stripIndents`
		My prefix is \`${guildPrefix}\`
		For a list of commands, type \`${guildPrefix}help\``);

	const args = msg.content
		.slice(prefix?.length || 0)
		.trim()
		.split(/ +/);

	const commandName = args.shift();
	if (!commandName) return;

	const settings = await msg.client.cache.getGuild(msg);
	if (
		(settings?.settings.blockedChannels.includes(msg.channel.id) && !msg.member!.permissionsIn(msg.channel).has('MANAGE_CHANNELS')) ||
		settings?.settings.blockedUsers.includes(msg.author.id)
	)
		return;

	const command = client.getCommand(commandName);
	if (!command) {
		if (msg.guild) return;
		return msg.channel.send(stripIndents`
		My prefix is \`${guildPrefix}\`
		For a list of commands, type \`${guildPrefix}help\``);
	}

	if (msg.client.helpers.missingPermissions(msg, ['EMBED_LINKS'], 'self')) return msg.channel.send('I require the `Embed Links` permission to run commands!');

	if (settings?.settings.disabledCommands.includes(command.name) && msg.client.helpers.missingPermissions(msg, ['MANAGE_GUILD'], msg.member!)) return;

	if (args.length === 1 && args[0].toLowerCase() === 'help')
		return client
			.getCommand('help')!
			.callback(msg, [command.name])
			.then(res => client.emit('commandUsed', msg, command, res))
			.catch(err => client.handleError(err, msg));

	if (!msg.content.endsWith('--force') || !msg.client.config.developers.includes(msg.author.id)) {
		if (command.devOnly && !msg.client.config.developers.includes(msg.author.id)) return;

		if (args.some(w => msg.client.constants.bannedWords.severe.includes(w)))
			return msg.client.helpers.wrongSyntax(msg, 'I refuse to run this command, because profanity like this is against our ToS.');

		if (command.guildOnly && !msg.guild) return msg.client.helpers.wrongSyntax(msg, `\`${prefix}${command.name}\` can only be used on a server!`);

		if (command.nsfw && !(await msg.client.helpers.isNSFW(msg)))
			return msg.client.helpers.wrongSyntax(
				msg,
				(await msg.client.cache.getGuild(msg))?.settings.nsfw
					? 'Please move to a NSFW channel to use this!'
					: `NSFW commands are not enabled on this server! Tell an Admin to run \`${guildPrefix}setnsfw\``
			);

		const memberMissing = command.memberPermission ? msg.client.helpers.missingPermissions(msg, command.memberPermission) : null;
		const botMissing = command.botPermission ? msg.client.helpers.missingPermissions(msg, command.botPermission, 'self') : null;

		if (memberMissing)
			return msg.client.helpers.wrongSyntax(
				msg,
				`You require the following permissions to use this command: ${memberMissing.map(ele => ele.toTitleCase()).join(', ')}`
			);

		if (botMissing)
			return msg.client.helpers.wrongSyntax(
				msg,
				`I require the following permissions to run this command: ${botMissing.map(ele => ele.toTitleCase()).join(', ')}`
			);

		if (args.length < command.args)
			return msg.client.helpers.wrongSyntax(
				msg,
				`This command requires ${command.args} arguments, but you only provided ${args.length}.\nPlease try again: \`${prefix}${command.name} ${command.usage}\``
			);
	}

	command
		.callback(msg, args)
		.then(res => client.emit('commandUsed', msg, command, res))
		.catch(err => client.handleError(err, msg));
};
