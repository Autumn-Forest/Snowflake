import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const playlist = msg.client.musicManager.getPlaylist(msg);
	if (!playlist) return msg.client.helpers.wrongSyntax(msg, "There's no playlist acutally");
	msg.channel.send(playlist.map(m => m.link));
};

export const command: Command = {
	aliases: ['queue'],
	description: "Return current guild's playlist",
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
