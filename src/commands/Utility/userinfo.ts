import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	const client = msg.client;
	const emojis = client.constants.emojis;

	const user = args.length ? await client.helpers.getUser(msg, args) : msg.author;
	if (!user) return;
	const member = msg.guild?.member(user);

	const activity = user.presence.activities.map(s => `${emojis[s.type]} ${s.name === 'Custom Status' ? s.state : s.name}`).join('\n');

	const description = stripIndents`
		${user.bot ? emojis.bot : emojis.user} ${user.username}
		${emojis.hash} ${user.id}
		${emojis.cake} ${client.helpers.nicerDates(user.createdAt)}
	`;
	const memberDescription = !member
		? ''
		: stripIndents`
		${emojis.diamond} ${member.roles.highest}
		${emojis.colour} ${member.roles.highest.hexColor}
		${emojis.nitro} ${member.premiumSince ? `Since ${client.helpers.nicerDates(member.premiumSince)}` : emojis.fail}
	`;

	const embed = client
		.newEmbed('INFO')
		.setAuthor(
			`${member?.displayName || user.username}`,
			user.presence.activities.some(p => p.type === 'STREAMING')
				? client.constants.statusIcons.streaming
				: client.constants.statusIcons[user.presence.status]
		)
		.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
		.setURL('https://discordapp.com/users/' + msg.author.id)
		.setDescription(description + (activity ? `\n${activity}` : '') + (memberDescription ? `\n${memberDescription}` : ''));

	if (member)
		embed.addField(
			'Permissions',
			member.permissions
				.toArray()
				.map(p => client.helpers.titleCase(p))
				.join(', ')
		);

	return msg.channel.send(embed);
};

export const command: Command = {
	name: 'userinfo',
	category: 'Utility',
	aliases: ['user', 'ui', 'whois'],
	description: 'Get a lot of info about a user',
	usage: '[User] (defaults to self)',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
