import { Command, Message } from '../../Client';
import { Bio } from 'discord.bio';
import { stripIndents } from 'common-tags';

const bio = new Bio();

const callback = async (msg: Message, args: string[]) => {
	const userID = args.length ? msg.mentions.users.first()?.id || args[0] : msg.author.id;

	const info = await bio.users.details(userID).catch(() => null);
	if (!info) return msg.client.helpers.wrongSyntax(msg, 'I was unable to find a bio matching your search. Please try again!');

	const user = (await msg.client.users.fetch(info.discord.id).catch(() => null)) || info.discord;

	const slug = await msg.client.helpers.fetch(`https://api.discord.bio/v1/user/details/${info.discord.id}`).then(user => user.payload.user.details.slug);

	const e = msg.client.constants.emojis;
	// ${e.thumbsUp} ${info.user.details.upvotes} seems upvote info isn't avalaible anymore
	const embed = msg.client
		.newEmbed('BASIC')
		.setAuthor(info.discord.username, user.displayAvatarURL({ dynamic: true }), `https://discord.bio/p/${slug}`)
		.setThumbnail(user.displayAvatarURL({ dynamic: true }))
		.setTitle(`${user.tag}'s Bio (\`${slug}\`)`)
		.setURL(`https://discord.bio/p/${slug}`)
		.setImage(info.user.details.banner!)
		.setDescription(
			stripIndents`
				${e.speech} ${info.user.details.description}
				${e.globe} ${info.user.details.location || '-'}
				${e.cake} ${info.user.details.birthday?.formatDate() || '-'}
				${e[info.user.details.gender || 'non-binary']} ${info.user.details.gender || '-'}
				${e.email} ${info.user.details.email || '-'}
				${e.clipboard} ${info.user.details.occupation || '-'}
				${e.discordLove} ${new Date(info.user.details.createdTimestamp).formatDate() || '-'}
				`
		);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['discordbio'],
	description: 'View discord.bio profiles',
	usage: '[user| slug]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
