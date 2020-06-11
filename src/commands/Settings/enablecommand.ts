import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;

	const commands = args.map(a => msg.client.getCommand(a)?.name).filter(e => !!e) as string[];
	if (!commands.length) return msg.client.helpers.wrongSyntax(msg, 'You did not provide any valid commands!');

	commands
		.filter(c => settings.settings.disabledCommands.includes(c))
		.forEach(c => settings.settings.disabledCommands.splice(settings.settings.disabledCommands.indexOf(c), 1));

	settings.save();

	return msg.channel.send('The following commands were successfully enabled:' + commands.join(', ').toCodeblock('css'));
};

export const command: Command = {
	aliases: ['enable', 'activate', 'on'],
	description: 'Enable one or more commands',
	usage: '<Command> (You can supply multiple)',
	args: 1,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD'],
	botPermission: [],
	callback: callback
};
