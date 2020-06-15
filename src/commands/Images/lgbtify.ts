import { Command, Message } from '../../Client';
import Lgbtify, { PrideFlags } from 'pfp.lgbt-wrapper';
const lgbtify = new Lgbtify();
let validFlags: PrideFlags[];

const callback = async (msg: Message, args: string[]) => {
	let [format, type, flag] = args;
	let url = args.pop();
	if (!url || !msg.client.helpers.isImageUrl(url)) url = msg.author.displayAvatarURL({ format: 'png', size: 256 });

	if (!validFlags) {
		const flags = await lgbtify.getFlags().catch(err => {
			msg.client.handleError(err, msg);
			return null;
		});
		if (!flags) return;
		validFlags = Object.keys(flags) as PrideFlags[];
	}

	if (format.toLowerCase() === 'flags') return msg.channel.send('Valid flags are:' + validFlags.join(', ').toCodeblock('css'));

	format = ['animated', 'static'].find(o => format.toLowerCase().startsWith(o)) || '';
	if (!format) return msg.client.helpers.wrongSyntax(msg, `${format} is not a valid format. Valid options are animated or static.`);

	type = ['circle', 'square'].find(o => type?.startsWith(o)) || '';
	if (!type) return msg.client.helpers.wrongSyntax(msg, `${type} is not a valid type. Valid options are circle or square.`);

	flag = validFlags.find(o => flag?.startsWith(o)) || '';
	if (!flag)
		return msg.client.helpers.wrongSyntax(
			msg,
			`${flag} is not a valid type. View all valid Pride flags via \`${await msg.client.getPrefix(msg)}lgbtify flags\``
		);

	const m = await msg.channel.send(msg.client.constants.emojis.loading);
	const img = await (format === 'animated'
		? lgbtify.createAnimated(url, flag as PrideFlags, type as 'circle')
		: lgbtify.createStatic(url, flag as PrideFlags, type as 'circle')
	).catch(err => {
		if (err.includes('image')) msg.client.helpers.wrongSyntax(msg, 'You did not provide a valid image. Please try again');
		else msg.client.helpers.wrongSyntax(msg, 'The api is currently busy. Please try again in a few seconds!');
	});
	if (!img) {
		if (m.deletable) m.delete().catch(() => null);
		return;
	}

	if (m.deletable) m.delete().catch(() => null);

	const out = await msg.channel.send(msg.author, { files: [{ name: `${flag}.${format === 'animated' ? 'gif' : 'png'}`, attachment: img }] });
	if (m.deletable) m.delete().catch(() => null);
	return out;
};

export const command: Command = {
	cooldown: 30,
	aliases: ['lgbt', 'lgbtq'],
	description: 'Lgbtify an image',
	usage: '<animated | static> <circle | square> <flag> [url (Defaults to your profile picture)]\nFor a list of valid flags, supply only the argument flags',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
