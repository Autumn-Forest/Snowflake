import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const member = await msg.client.helpers.getMember(msg, args, 0);
	if (!member) return;

	if (!msg.client.helpers.isMemberHigher(msg.member, member))
		return msg.client.helpers.wrongSyntax(msg, 'You cannot block this user from using commands, because your position is not higher than theirs!');

	// const reason = args.slice(1).join(' ') || 'No reason provided';

	const settings = await msg.client.cache.getGuild(msg);

	const alreadyBlocked = settings.settings.blockedUsers.includes(member.id);
	if (alreadyBlocked) settings.settings.blockedUsers.splice(settings.settings.blockedUsers.indexOf(member.id, 1));
	else settings.settings.blockedUsers.push(member.id);
	settings.save();

	return msg.channel.send(`Successfully ${alreadyBlocked ? 'enabled' : 'disabled'} all commands for ${member.displayName}!`);
};

export const command: Command = {
	aliases: ['block', 'disableuser'],
	description: 'Block a user from using commands',
	usage: '<User> [Reason]',
	args: 1,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['MANAGE_GUILD'],
	botPermission: [],
	callback: callback
};
