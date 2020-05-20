import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const webhooks = await msg.client.cache.getClient();
	const succeeded = (await Promise.all(webhooks.annoucementsWebhooks.map(id => msg.client.webhooks.send(id, args.join(' ')))).catch(() => undefined))?.filter(
		val => typeof val !== 'undefined'
	);
	return msg.channel.send(`Succefully announced in ${succeeded ? ` ${succeeded?.length} guilds!` : ' 0 guild! wait what?! An error happened :/'} `);
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
