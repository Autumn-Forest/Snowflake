import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const embed = msg.client.newEmbed('INFO').setAuthor('Prefixes', msg.author.displayAvatarURL({ dynamic: true }));

	if (msg.client.helpers.isGuild(msg)) {
		embed.addFields([
			{ name: 'Server prefix', value: await msg.client.getPrefix(msg), inline: true },
			{
				name: 'Additional Server prefixes',
				value: (await msg.client.getPrefixes(msg))?.join(',\n') || 'None',
				inline: true
			}
		]);
	}
	embed.addField('User prefixes', (await msg.client.getUserPrefixes(msg.author))?.join('\n') || 'None', true);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['myprefix', 'myprefixes', 'displayprefixes'],
	description: 'Check all available prefixes',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
