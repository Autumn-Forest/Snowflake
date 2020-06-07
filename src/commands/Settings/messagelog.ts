import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, _args: string[]) => {
	const regex = msg.client.constants.regex.snowflake;
	const channelID = msg.mentions.channels.first()?.id || regex.exec(msg.content)?.[0];
	if (!channelID) return;

	const settings = await msg.client.cache.getGuild(msg);
	if (!settings) return;

	if (!channelID) {
		await msg.client.webhooks.delete(settings.channels.messageLogWebhook, `Message logs disabled by ${msg.author.tag}`);
		settings.channels.messageLogWebhook = '';
	} else {
		const channel = await msg.client.channels.fetch(channelID);
		if (!(channel instanceof TextChannel)) return;

		if (!channel.permissionsFor(msg.author)?.has(['MANAGE_WEBHOOKS', 'MANAGE_CHANNELS']))
			return msg.client.helpers.wrongSyntax(msg, "You don't have required perms on this guild");

		const webhookID = await msg.client.webhooks.create(
			msg,
			channel,
			'Snowflake Logger',
			msg.client.user!.displayAvatarURL(),
			`Message logs enabled by ${msg.author.tag}.`
		);

		if (!webhookID)
			return msg.client.helpers.wrongSyntax(
				msg,
				'Failed to create the log webhook. Please make sure I have permissions to create webhook in the target channel!'
			);

		settings.channels.messageLogWebhook = webhookID;
	}

	settings.save();
	return msg.channel.send(`The message log ${channelID ? `channel has successfully been set to <#${channelID}>` : 'has successfully been disabled'}!`);
};

export const command: Command = {
	name: 'messagelog',
	category: 'Settings',
	aliases: ['log', 'setmessagelog'],
	description: 'Set the modlog-channel',
	usage: '[Channel]',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_WEBHOOKS'],
	botPermission: [],
	callback: callback
};
