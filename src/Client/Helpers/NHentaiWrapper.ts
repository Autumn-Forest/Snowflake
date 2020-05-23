import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export class NHentaiWrapper {
	private readonly baseUrl = 'https://nhentai.net/api/';
	private readonly thumbnailUrl = 'https://t.nhentai.net/galleries/{MEDIA_ID}/cover.jpg';
	private readonly pageUrl = 'https://i.nhentai.net/galleries/{MEDIA_ID}/{PAGE}.jpg';
	private readonly nHentaiColour = 'eb2754';
	private readonly nHentaiLogo = 'https://i.imgur.com/uLAimaY.png';
	url: string;
	hentai?: NHentaiData = undefined;
	currentPage = 0;
	totalPages = 0;
	embed = new MessageEmbed().setColor(this.nHentaiColour).setAuthor('nHentai', this.nHentaiLogo);
	pages: MessageEmbed[] = [];

	/**
	 * @param query Id or tags
	 */
	constructor(query: string) {
		this.url = this.baseUrl + (parseInt(query) ? `gallery/${query}` : `galleries/search?query=${query.replace(/ +/, '%20')}`);
	}

	/**
	 * This fetches the hentai. ALWAYS run this after creating the object!!
	 * @returns true if successful or false if no hentai was found
	 */
	async fetch() {
		let res: NHentaiData = await fetch(this.url).then(res => res.json());
		if (res.error) return false;

		//@ts-ignore
		if (res.result) res = res.result.length ? res.result[Math.floor(Math.random() * res.result.length)] : null;
		if (!res) return false;

		this.hentai = res;
		this.totalPages = res.num_pages;

		this.embed
			.setTitle(res.title.pretty || res.title.english || res.title.japanese)
			.setURL(`https://nhentai.net/g/${res.id}`)
			.setDescription(this.hentai.tags.map(tag => tag.name).join(', '))
			.setImage(this.thumbnailUrl.replace('{MEDIA_ID}', this.hentai?.media_id!))
			.setTimestamp();
		return true;
	}

	/**
	 * Gets the next page
	 * @returns Embed
	 */
	get nextPage() {
		if (this.currentPage === this.totalPages) return;
		const embed = JSON.parse(JSON.stringify(this.embed));
		this.pages.push(embed);
		this.currentPage++;
		this.embed
			.setImage(this.pageUrl.replace('{MEDIA_ID}', this.hentai?.media_id!).replace('{PAGE}', this.currentPage.toString()))
			.setDescription('')
			.setFooter(`${this.currentPage}/${this.totalPages}`);
		return embed;
	}

	/**
	 * Gets the previous page
	 * @returns Embed
	 */
	get previousPage() {
		if (!this.pages.length) return;
		this.currentPage--;
		return this.pages.pop();
	}
}

interface NHentaiData {
	// It has more shit but only these are relevant for us lol
	id: number;
	media_id: string;
	title: {
		english: string;
		japanese: string;
		pretty: string;
	};
	upload_date: number;
	tags: {
		id: number;
		type: string;
		name: string;
		url: string;
		count: number;
	}[];
	num_pages: number;
	num_favorites: number;
	// This is NOT on a successful response, only on a failed one!
	error: boolean;
}
