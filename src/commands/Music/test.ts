import { Command, Message } from '../../Client';
import YoutubeDlWrap from '../../bin/youtube-dl';
//import { Readable } from 'stream';
//import { spawn } from 'child_process';
const youtubeDlWrap = new YoutubeDlWrap();
//-x --audio-format opus

const callback = async (msg: Message, args: string[]) => {
	let voice;
	if (!msg.member) return;
	if (msg.member.voice.channel) voice = await msg.member.voice.channel.join();
	else return;
	voice.play(youtubeDlWrap.execStream([`${args[0]}`]));
	const info = await youtubeDlWrap.getVideoInfo(args);
	const embed = msg.client
		.newEmbed('BASIC')
		.setDescription(`[${info.title}](${info.webpage_url})\n${info.uploader ? `[${info.uploader}](${info.uploader_url})` : 'No info on uploader.'}`)
		.setThumbnail(info.thumbnail);
	msg.channel.send(embed);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
