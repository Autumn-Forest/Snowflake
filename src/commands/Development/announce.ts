import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const webhooks = await msg.client.cache.getClient();
	webhooks.annoucementsWebhooks.map(id => msg.client.webhooks.send(id, args.join(' ')));
	return msg.channel.send(`Succefully announced in ${webhooks.annoucementsWebhooks.length} guilds!`);
};

export const command: Command = {
	name: 'announce',
	category: 'Dev',
	aliases: [],
	description: 'Do an announcement !',
	usage: '',
	args: 0,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
