import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, _args: string[]) => {
	const regex = new RegExp(/\d{17,19}/);
	const channel = msg.mentions.channels.first()?.id || regex.exec(msg.content)?.[0] || '';
	const settings = await msg.client.cache.getGuild(msg);
	const annoucement = await msg.client.cache.getClient();
	if (!settings) return;
	if (!channel) {
		await msg.client.webhooks.delete(settings.channels.annoucementsWebhook, `Announcements got desactivated by ${msg.author.tag}`);
		annoucement.annoucementsWebhooks = annoucement.annoucementsWebhooks.filter(item => item !== settings.channels.annoucementsWebhook);
		settings.channels.annoucementsWebhook = channel;
	} else {
		if (settings.channels.annoucementsWebhook)
			return msg.client.helpers.wrongSyntax(
				msg,
				`Oop ! You already have an annoucements channel set! Use \`${settings.settings.prefix}annoucement\` to desactivate it!`
			);
		const leChannel = await msg.client.channels.fetch(channel);
		if (!leChannel) return;
		if (!(leChannel instanceof TextChannel)) return;
		if (!leChannel.permissionsFor(msg.author)!.has(['MANAGE_WEBHOOKS', 'MANAGE_CHANNELS']))
			return msg.client.helpers.wrongSyntax(msg, "You don't have required perms on this guild");
		const webhookID = await msg.client.webhooks.create(
			msg,
			leChannel,
			'Snowflake annoucement',
			'https://cdn.discordapp.com/avatars/709570149107367966/5a788241e762a89bae17019bcdcbec75.webp?size=2048',
			`${msg.author.tag} created an annoucement channel for official annoucement about Snowflake!`
		);
		if (!webhookID) return;
		settings.channels.annoucementsWebhook = webhookID;
		annoucement.annoucementsWebhooks.push(webhookID);
	}
	settings.save();
	annoucement.save();
	return msg.channel.send(`The annoucement channel ${channel ? `has successfully been set to <#${channel}>` : 'has successfully been disabled'}!`);
};

export const command: Command = {
	name: '	',
	category: 'Settings',
	aliases: ['annoucement', 'setannoucement', 'setannoucement'],
	description: 'Set the channel where will be displayed every annoucement about Snowflake!',
	usage: '[Channel]',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_WEBHOOKS'],
	botPermission: [],
	callback: callback
};
