import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	const data = await msg.client.helpers.fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			query: msg.client.constants.animeQuery,
			variables: {
				search: args.join(' '),
				page: 1,
				perPage: 1
			}
		})
	});

	const media = data.data.Page.media[0];
	if (!media) return msg.client.helpers.wrongSyntax(msg, 'I was not able to find an Anime or Manga matching your search.');
	if (media.isAdult && (!(msg.channel instanceof TextChannel) || !msg.channel.nsfw))
		return msg.client.helpers.wrongSyntax(msg, 'This anime is NSFW, so I cannot display it. Try using a NSFW channel!');

	const names = media.synonyms;
	if (media.title.english !== 'null' && media.title.english) names.push(media.title.english);
	if (media.title.native !== 'null' && media.title.native) names.push(media.title.native);

	const output = msg.client
		.newEmbed('BASIC')
		.setTitle(media.title.romaji || media.title.english || media.title.english)
		.setURL(media.siteUrl)
		.setThumbnail(media.coverImage.extraLarge)
		.setImage(media.bannerImage)
		.setDescription(`${media.description.replace(/<[^>]*>/gi, '').shorten(2000)}\n[More Info can be found here!](${media.siteUrl})`)
		.addFields([
			{ name: 'Other Names', value: names.join('\n') || '-' },
			{ name: '🎲 Genres', value: media.genres.join(', ') || '-' },
			{ name: '⏳ Status', value: (media.status || '-').toTitleCase(), inline: true },
			{ name: '⭐ Average Rating', value: media.averageScore ? media.averageScore + '%' : '-', inline: true },
			{ name: '🎬 Format', value: (media.format || '-').toTitleCase(), inline: true },
			{ name: '💽 Episodes', value: media.episodes || media.chapters || '-', inline: true },
			{
				name: '🗓️ Started on',
				value: media.endDate.month
					? `${msg.client.helpers.numToMonth(media.startDate.month - 1)} ${msg.client.helpers.numToOrdinal(media.startDate.day)} ${
							media.startDate.year
					  }`
					: '-',
				inline: true
			},
			{
				name: '🗓️ Finished on',
				value: media.endDate.month
					? `${msg.client.helpers.numToMonth(media.endDate.month - 1)} ${msg.client.helpers.numToOrdinal(media.endDate.day)} ${media.endDate.year}`
					: '-',
				inline: true
			}
		]);
	return msg.channel.send(output);
};

export const command: Command = {
	name: 'anime',
	category: 'Utility',
	aliases: ['manga', 'animelist', 'anilist', 'ani'],
	description: 'Look up your favourite Anime or Manga!',
	usage: '<name>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
