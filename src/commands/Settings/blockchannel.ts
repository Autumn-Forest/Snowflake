import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const channel = msg.mentions.channels.first() || msg.channel;
	if (!msg.member.permissionsIn(channel).has('MANAGE_CHANNELS')) return msg.client.helpers.wrongSyntax(msg, 'You cannot manage that channel!');

	const settings = await msg.client.cache.getGuild(msg);

	const alreadyBlocked = settings.settings.blockedChannels.includes(channel.id);
	if (alreadyBlocked) settings.settings.blockedChannels.splice(settings.settings.blockedChannels.indexOf(channel.id, 1));
	else settings.settings.blockedChannels.push(channel.id);
	settings.save();

	return msg.channel.send(`Successfully ${alreadyBlocked ? 'enabled' : 'disabled'} commands in ${channel}!`);
};

export const command: Command = {
	aliases: ['blockchan', 'togglechannel', 'disablechannel'],
	description: 'Enable/Disable commands in this channel',
	usage: '[#Channel] (Defaults to current channel)',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_CHANNELS'],
	botPermission: [],
	callback: callback
};
