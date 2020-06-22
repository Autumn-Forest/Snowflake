import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	if (!args.length) return msg.client.getCommand('prefixes')!.callback(msg, args);

	let [scope, action, prefix] = args;
	if (!action) {
		prefix = scope;
		scope = 'server';
		action = 'set';
	}

	if (!prefix)
		return msg.client.helpers.wrongSyntax(
			msg,
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			`This command requires ${command.args} arguments, but you only provided ${args.length}.\nPlease use it like this: \`${prefix}prefix ${command.usage}\``
		);

	if (!['server', 'user'].includes(scope.toLowerCase()))
		return msg.client.helpers.wrongSyntax(
			msg,
			stripIndents`
            You did not provide a valid scope. Please provide one of the following:
            > Server - Manage this server's prefixes
            > User - Manage your own prefixes`
		);

	if (!['set', 'add', 'remove'].includes(action.toLowerCase()))
		return msg.client.helpers.wrongSyntax(
			msg,
			stripIndents`
            You did not provide a valid action. Please provide one of the following:
            > set - Disable all other prefixes and set the prefix to the provided prefix
            > add - Add an additional prefix
            > remove - Remove a prefix`
		);

	if (scope.toLowerCase() === 'server') {
		if (msg.client.helpers.missingPermissions(msg, ['MANAGE_GUILD']))
			return msg.client.helpers.wrongSyntax(msg, 'You require the `Manage Server` Permission to do this.');

		const settings = await msg.client.cache.getGuild(msg);
		if (!settings) return msg.client.helpers.wrongSyntax(msg, 'You can only do this on a server.');

		switch (action.toLowerCase()) {
			case 'set':
				settings.settings.prefixes = [];
				settings.settings.prefix = prefix;
				msg.channel.send(`Successfully set the server prefix to \`${prefix}\``);
				break;
			case 'add':
				if (settings.settings.prefixes.some(p => p === prefix)) return msg.client.helpers.wrongSyntax(msg, 'That is already a prefix!');
				settings.settings.prefixes.push(prefix);
				msg.channel.send(`Successfully added the following server prefix: \`${prefix}\``);
				break;
			case 'remove':
				if (!settings.settings.prefixes.some(p => p === prefix)) return msg.client.helpers.wrongSyntax(msg, 'That is not a prefix!');
				settings.settings.prefixes.splice(settings.settings.prefixes.indexOf(prefix, 1));
				msg.channel.send(`Successfully removed the following server prefix: \`${prefix}\``);
				break;
		}
		settings.save();
	} else {
		const settings = await msg.client.cache.getUser(msg.author);

		switch (action.toLowerCase()) {
			case 'set':
				settings.prefixes = [];
				settings.prefixes.push(prefix);
				msg.channel.send(`Successfully set your prefix to \`${prefix}\``);
				break;
			case 'add':
				if (settings.prefixes.some(p => p === prefix)) return msg.client.helpers.wrongSyntax(msg, 'That is already a prefix!');
				settings.prefixes.push(prefix);
				msg.channel.send(`Successfully added the following prefix: \`${prefix}\``);
				break;
			case 'remove':
				if (!settings.prefixes.some(p => p === prefix)) return msg.client.helpers.wrongSyntax(msg, 'That is not a prefix!');
				settings.prefixes.splice(settings.prefixes.indexOf(prefix, 1));
				msg.channel.send(`Successfully removed the following prefix: \`${prefix}\``);
				break;
		}
		settings.save();
	}
};

export const command: Command = {
	aliases: ['p', 'pref', 'setprefix'],
	description: 'Set my prefix. You can either set it for a server or only for yourself',
	usage: '<Server | User> <set | add | remove> <prefix>',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
