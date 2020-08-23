import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const member = await msg.client.helpers.getMember(msg, args, 0);
	const reason = args.slice(1).join(' ') || 'No reason provided';
	member;
	reason;
};

export const command: Command = {
	aliases: [],
	description: 'Ban a member',
	usage: '<Member> [Reason]',
	args: 1,
	devOnly: true,
	guildOnly: true,
	nsfw: false,
	memberPermission: ['BAN_MEMBERS'],
	botPermission: ['BAN_MEMBERS'],
	callback: callback
};
