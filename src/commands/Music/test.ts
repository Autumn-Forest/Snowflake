import { Command, Message } from '../../Client';
import YoutubeDlWrap from '../../bin/youtube-dl';
//import { Readable } from 'stream';
//import { spawn } from 'child_process';
const youtubeDlWrap = new YoutubeDlWrap('/home/naia/Snowflake/src/bin/youtube-dl');
//-x --audio-format opus

const callback = async (msg: Message, args: string[]) => {
	let voice;
	if (!msg.member) return;
	if (msg.member.voice.channel) voice = await msg.member.voice.channel.join();
	else return;
	voice.play(youtubeDlWrap.execStream([`${args[0]} -x --audio-format opus`]));
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	args: 1,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
