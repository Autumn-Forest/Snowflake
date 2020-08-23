import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	msg.client.pagination.create(
		msg,
		[1, 2, 3].map(n => msg.client.newEmbed('BASIC').setDescription(n)),
		0,
		args.length ? ['716488340823736380', '718506085694308495', '716412963052847207'] : undefined
	);
};

export const command: Command = {
	aliases: [],
	description: 'Test the pagination',
	usage: '[custom]',
	args: 0,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
