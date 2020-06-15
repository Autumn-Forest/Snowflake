import { MessageEmbed, TextChannel } from 'discord.js';
import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	// Get the guild's settings if on a guild and determine the prefix that needs to be used in the help
	const client = msg.client;
	const guildSettings = msg.guild ? await client.database.guildSettings.findOne({ guild: msg.guild.id }) : null;
	const prefix = guildSettings?.settings.prefix || client.config.defaultPrefix;

	// Check if we should display Dev commands and NSFW commands
	const isNsfw = msg.channel instanceof TextChannel && msg.channel.nsfw;
	const isDev = client.config.developers.includes(msg.author.id);

	// Initiate the output embed
	const output = new MessageEmbed().setTimestamp().setColor('RANDOM');

	// If no arguments are provided, send all commands
	if (!args.length) {
		// Do some Voodoo magic to create an object having all commands sorted by their category
		const commandList: { [key: string]: string[] } = {};
		client.commands.forEach(command => {
			// Check if commands should be displayed or hidden (Dev and NSFW check)
			if ((command.devOnly && !isDev) || (command.nsfw && !isNsfw)) return;

			if (!commandList[command.category]) commandList[command.category] = [];
			commandList[command.category].push(`\`${prefix}${command.name}\` - ${command.description || 'This command has no description.'}`);
		});

		output
			.setTitle('Help menu')
			.setFooter(`To get info on a specific command, use ${prefix}help [command name]`)
			.addFields(
				// Create one field per category having all commands separated by new lines
				Object.keys(commandList).map(category => {
					return { name: category, value: commandList[category].join('\n') };
				})
			);
		return msg.channel.send(output);
	}

	// Get the command from the provided args
	const commandName = args.join(' ').toLowerCase();
	const command = client.commands.find(cmd => cmd.name === commandName || cmd.aliases.includes(commandName));
	if (!command) return msg.channel.send('That is not a valid command!');

	// Make sure we can display this here
	if ((command.devOnly && !isDev) || (command.nsfw && !isNsfw)) return;

	const emojis = client.constants.emojis;

	output
		.setTitle(prefix + command.name)
		.addFields([
			{ name: 'Description', value: command.description },
			{
				name: 'Usage',
				value: `${prefix}${command.name}${command.usage ? ' ' + command.usage : ''}`.toCodeblock('css')
			},
			{ name: 'Aliases', value: command.aliases.join(', ') || `${command.name} has no aliases.` }
		])
		.setDescription(
			stripIndents`
				Cooldown: ${command.cooldown ? `\`${command.cooldown}s\`` : emojis.fail}
				Guild only: ${command.guildOnly ? emojis.success : emojis.fail}
				NSFW: ${command.nsfw ? emojis.success : emojis.fail}
				Requires arguments: ${command.args || emojis.fail}
				Requires Permissions: ${command.memberPermission.length ? command.memberPermission.map(p => p.toTitleCase()).join(', ') : emojis.fail}
		`
		);

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['h', 'info', 'commands'],
	description: 'Get a list of all commands or info on a specific command',
	usage: '[command name]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
