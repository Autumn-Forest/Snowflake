import { Command, Message } from '../../Client';
import { Bio } from 'discord.bio';

const bio = new Bio();

const callback = async (msg: Message, args: string[]) => {
	const regex = msg.client.constants.regex.snowflake;
	let user;
	if (args[0]) user = msg.mentions.users.first()?.id || regex.exec(args[0])?.[0];
	else user = msg.author.id;
	const info = await bio.users.details(user).catch(() => null);
	if (!info)
		return msg.client.helpers.wrongSyntax(
			msg,
			"No result? Try to tag an user or use a valid slug\n Or they may just don't have a profile on https://discord.bio"
		);
	user = await msg.client.users.fetch(info.discord.id).catch(() => null);
	let bd;
	let created;
	if (info.user.details.birthday) bd = new Date(info.user.details.birthday);
	if (info.user.details.created_at) created = new Date(info.user.details.created_at);
	const dateTimeFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	});
	// prohack untill the wrapper is debugged
	const slug = await msg.client.helpers.fetch(`https://api.discord.bio/v1/user/details/${info.discord.id}`).then(user => user.payload.user.details.slug);
	const embed = msg.client
		.newEmbed('BASIC')
		.setAuthor(
			info.discord.username,
			user?.displayAvatarURL({ dynamic: true }) || info.discord.displayAvatarURL({ dynamic: true }),
			`https://discord.bio/p/${slug}`
		)
		.setThumbnail(user?.displayAvatarURL({ dynamic: true }) || info.discord.displayAvatarURL({ dynamic: true }))
		.setTitle(`Bio of ${user?.tag || info.discord.tag}\n(\`${slug}\`)`)
		.setURL(`https://discord.bio/p/${slug}`)
		.setImage(info.user.details.banner || 'https://your.is-inside.me/6PINEw1T.png')
		.setDescription(`**About:** ${info.user.details.description}\n**Upvote:** ${info.user.details.upvotes}`)
		.addFields(
			{ name: 'Location', value: info.user.details.location || 'not set', inline: true },
			{ name: 'Birthday', value: dateTimeFormat.format(bd) || 'not set', inline: true },
			{ name: 'gender', value: info.user.details.gender || 'not set', inline: true },
			{ name: 'email', value: info.user.details.email || 'not set', inline: true },
			{ name: 'occupation', value: info.user.details.occupation || 'not set', inline: true },
			{ name: 'Created at', value: dateTimeFormat.format(created) || 'not set', inline: true }
		);
	return msg.channel.send(embed);
};

export const command: Command = {
	name: 'bio',
	category: 'Utility',
	aliases: ['discordbio'],
	description: 'Show your or someone Discord.bio profile.',
	usage: "[user|discord.bio's slug]",
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};
