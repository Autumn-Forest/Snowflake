import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const channel = msg.mentions.channels.first() || msg.channel;

	const settings = await msg.client.cache.getGuild(msg);

	if (args.length && args[0].toLowerCase() === 'disable') {
		await msg.client.webhooks.delete(settings.channels.messageLogWebhook, `Message log disabled by ${msg.member.displayName}`);
		settings.channels.messageLogWebhook = '';
		settings.save();
		return msg.channel.send('Successfully disabled the message log!');
	}

	if (!channel.permissionsFor(msg.author)?.has(['MANAGE_CHANNELS']))
		return msg.client.helpers.wrongSyntax(msg, "You don't have permission to manage this channel!");
	if (!channel.permissionsFor(msg.client.user!)?.has(['MANAGE_WEBHOOKS']))
		return msg.client.helpers.wrongSyntax(msg, 'I require the Manage Webhooks Permission in the target channel to create the message log webhook!');

	if (settings.channels.messageLogWebhook) {
		msg.channel.send('This server already has a log in another channel. Deleting...').then(m => m.delete({ timeout: 5000 }).catch(() => null));
		await msg.client.webhooks.delete(settings.channels.messageLogWebhook, `Message log channel set to ${channel.name} by ${msg.member.displayName}`);
	}

	const webhookID = await msg.client.webhooks.create(
		msg,
		channel,
		'Snowflake Logger',
		msg.client.user!.displayAvatarURL(),
		`Message logs enabled by ${msg.author.tag}.`
	);

	if (!webhookID) return msg.client.helpers.wrongSyntax(msg, 'Something went wrong and I failed to create the log webhook.');

	settings.channels.messageLogWebhook = webhookID;

	settings.save();
	return msg.channel.send(`The message log channel has successfully been set to ${channel}`);
};

export const command: Command = {
	aliases: ['log', 'setmessagelog'],
	description: 'Set the modlog-channel',
	usage: '[Channel | disable]',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_WEBHOOKS'],
	botPermission: [],
	callback: callback
};
