import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, _args: string[]) => {
	const g = msg.guild;
	if (!g) return;

	const emojis = msg.client.constants.emojis;
	const roles = g.roles.cache.filter(r => r.id !== g.id).array();
	const channels = g.channels.cache.filter(c => c.type === 'text').array();

	const embed = msg.client
		.newEmbed('INFO')
		.setThumbnail(g.iconURL({ size: 1024, dynamic: true })!)
		.setImage(g.splashURL({ size: 2048 })!)
		.setTitle(g.name)
		.setDescription(
			stripIndents`
            ${emojis.crown} ${g.owner || (await msg.client.users.fetch(g.ownerID))}
            ${emojis.hash} ${g.id}
            ${emojis.globe} ${g.region}
            ${emojis.cake} ${msg.client.helpers.nicerDates(g.createdAt)}
            ${emojis.speech} ${g.description || '-'}
            ${emojis.users} ${g.memberCount}
            ${emojis.smiley} ${g.emojis.cache.size}
            ${emojis.nitro} ${g.premiumSubscriptionCount} (Level ${g.premiumTier})
            `
		)
		.addFields([
			{
				name: `Roles ${roles.length}`,
				value: roles.join(', ').length < 1025 ? roles.join(', ') : 'Sorry, there are too many roles, so I cannot display them here.'
			},
			{
				name: `Channels ${g.channels.cache.size}`,
				value: channels.join(', ').length < 1025 ? channels.join(', ') : 'Sorry, there are too many channels, so I cannot display them here.'
			}
		]);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['server', 'si'],
	description: 'Display a bunch of info about the server',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
