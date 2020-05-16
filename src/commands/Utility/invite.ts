import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const ee = msg.client
		.newEmbed('INFO')
		.setTitle('Invite me!')
		.setDescription(
			`[Click here to add me to you server ;D](https://discordapp.com/oauth2/authorize?client_id=${msg.client.user!.id}&permissions=1580592383&scope=bot)`
		);
	msg.channel.send(ee);
};

export const command: Command = {
	name: 'invite',
	category: 'Utility',
	aliases: ['inv'],
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
