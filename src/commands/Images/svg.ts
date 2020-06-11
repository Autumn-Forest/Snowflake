import { Command, Message } from '../../Client';
import sharp from 'sharp';
import fetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	const res = args[0].match(/^\d+$/);
	if (res) args.shift();

	const url = args.join(' ').match(msg.client.constants.regex.links);
	const buf = url ? await fetch(url[0]).then(res => res.buffer()) : null;
	if (!buf) return;

	let img = sharp(buf, { density: 2400 });
	await img.metadata().then(data => {
		if (!data.width || !data.height) return;
		const multiplier = (res ? parseInt(res[0]) : 256) / data.width;
		img = img.resize(Math.round(data.width * multiplier), Math.round(data.height * multiplier));
	});

	return msg.channel.send({ files: [img] });
};

export const command: Command = {
	aliases: [],
	description: "I am lazy so here's a svg to png thingie",
	usage: '<link / code>',
	args: 1,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
