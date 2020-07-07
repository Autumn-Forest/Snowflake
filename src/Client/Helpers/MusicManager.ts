import { Client, Message } from '..';
import { Collection, VoiceChannel, StreamDispatcher } from 'discord.js';
import { Music } from '../Interfaces/MusicManagerData';
import YoutubeDlWrap from '../../bin/youtube-dl';
const youtubeDl = new YoutubeDlWrap();

export default class MusicManager {
	private guildMusic: Collection<string, Music> = new Collection();
	//guildPlaylist: object[] = [];
	//private client: Client;
	constructor(_client: Client) {
		//this.client = client;
	}

	/**
	 * Add a music to the guild's playlist and return it
	 * @param link The link of the music the user want to play (only link)
	 * @param msg Message to get the guild's and users's id
	 * @param info the object of the song gave by the get info.
	 */
	addToPlaylist(link: string, msg: Message, info: object) {
		if (!msg.guild) return;
		if (this.guildMusic.get(msg.guild.id)?.playlist) {
			const music = this.guildMusic.get(msg.guild.id);
			if (!music) return;
			if (!music.playlist) music.playlist = [{ user: msg.author.tag, link: link, more: info }];
			else music.playlist.push({ user: msg.author.tag, link: link, more: info });
			this.guildMusic.set(msg.guild.id, music);
			return music.playlist;
		} else {
			this.guildMusic.set(msg.guild.id, {
				playlist: [{ user: msg.author.tag, link: link, more: info }],
				currentStreamDispatcher: undefined,
				currrentVoiceConnection: undefined
			});
			return this.guildMusic.get(msg.guild!.id)?.playlist;
		}
	}

	/**
	 * Get the Playlist of the guild, return undefined if inexistant
	 * @param msg message to get guild's id
	 */
	getPlaylist(msg: Message) {
		if (!msg.guild) return;
		return this.guildMusic.get(msg.guild.id)?.playlist;
	}

	/**
	 * get info, return a json.
	 * @param link Link of the video/playlist you wanna get info
	 */
	async getInfo(link: string[] | string) {
		return await youtubeDl.getVideoInfo(link);
	}

	private async uptdateVoiceConnection(msg: Message, _music: Music, voiceChannel?: VoiceChannel) {
		if (!msg.client.helpers.isGuild(msg)) return;
		if (!msg.client.voice?.connections.get(msg.guild.id)) {
			if (!voiceChannel) {
				if (!msg.member.voice.channel) return;
				voiceChannel = msg.member.voice.channel;
			}
			return await voiceChannel.join();
		} else return msg.client.voice.connections.get(msg.guild.id);
	}

	async play(msg: Message, voiceChannel?: VoiceChannel, _stream?: StreamDispatcher) {
		if (!msg.client.helpers.isGuild(msg)) return;
		const music = this.guildMusic.get(msg.guild.id);
		if (!music) return;
		if (!music.playlist) return;
		if (!music.currrentVoiceConnection) music.currrentVoiceConnection = await this.uptdateVoiceConnection(msg, music, voiceChannel);
	}
}
