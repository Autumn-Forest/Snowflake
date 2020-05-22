import { Command, Message } from '../../Client';
import { Bio } from 'discord.bio';

const bio = new Bio();

const callback = async (msg: Message, args: string[]) => {
	const regex = msg.client.constants.regex.snowflake;
	let user;
	if (args[0]) user = msg.mentions.users.first()?.id || regex.exec(args[0])?.[0] || args[0];
	else user = msg.author.id;
	const info = await bio.details(user).catch(() => null);
	if (!info)
		return msg.client.helpers.wrongSyntax(
			msg,
			"No result? Try to tag an user or use a valid slug\n Or they may just don't have a profile on https://discord.bio"
		);
	user = await msg.client.users.fetch(info.discord.id).catch(() => null);
	const embed = msg.client
		.newEmbed('BASIC')
		.setAuthor(
			info.discord.username,
			user?.displayAvatarURL({ dynamic: true }) || info.discord.displayAvatarURL,
			`https://discord.bio/p/${info.settings.name}`
		)
		.setThumbnail(user?.displayAvatarURL({ dynamic: true }) || info.discord.displayAvatarURL)
		.setTitle(`Bio of ${user?.tag || info.discord.tag}\n(\`${info.settings.name}\`)`)
		.setURL(`https://discord.bio/p/${info.settings.name}`)
		.setImage(info.settings.banner || 'https://your.is-inside.me/6PINEw1T.png')
		.setDescription(`**About:** ${info.settings.description}\n**Upvote:** ${info.settings.upvotes}`)
		.addFields(
			{ name: 'Location', value: info.settings.location || 'not set', inline: true },
			{ name: 'Birthday', value: info.settings.birthday || 'not set', inline: true },
			{ name: 'gender', value: info.settings.gender || 'not set', inline: true }
		);
	msg.channel.send(embed);
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
	botPermission: [],
	callback: callback
};
