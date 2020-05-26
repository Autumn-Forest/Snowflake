import { Command, Message } from '../../Client';
import sharp from 'sharp';
import fetch from 'node-fetch';

const callback = async (msg: Message, args: string[]) => {
	const res = args[0].match(/^\d+$/);
	if (res) args.shift();

	const url = args.join(' ').match(msg.client.constants.regex.links);
	const buf = url ? await fetch(url[0]).then(res => res.buffer()) : Buffer.from(flattenSVG(args.join()));

	let img = sharp(buf, { density: 2400 });
	await img.metadata().then(data => {
		if (!data.width || !data.height) return;
		const multiplier = (res ? parseInt(res[0]) : 256) / data.width;
		img = img.resize(Math.round(data.width * multiplier), Math.round(data.height * multiplier));
	});

	return msg.channel.send({ files: [img] });
};

export const command: Command = {
	name: 'svg',
	category: 'Dev',
	aliases: [],
	description: 'I am lazy so heres a svg to png thingie',
	usage: '<link / code>',
	args: 1,
	devOnly: true,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

// Thank you StackOverflow
function flattenSVG(svg: string) {
	const images = svg.match(/<image [^>]+>/g);
	if (!images || images.length < 1) {
		return svg;
	}

	let result = svg;
	images.forEach(image => {
		const [, data] = image.match(/ xlink:href="data:image\/svg\+xml;base64,([^"]+)"/) || [];
		if (!data) {
			return;
		}

		const innerSVG = Buffer.from(data, 'base64').toString();
		const [, width] = image.match(/ width="([^"]+)"/) || [];
		const [, height] = image.match(/ height="([^"]+)"/) || [];
		const [, opacity] = image.match(/ opacity="([^"]+)"/) || [];
		const [, x] = image.match(/ x="([^"]+)"/) || [];
		const [, y] = image.match(/ y="([^"]+)"/) || [];
		const [header] = (innerSVG && innerSVG.match(/<svg[^>]+>/)) || [];
		const fixedHeader = header
			.replace(/ (x|y|width|height)="([^"]+)"/g, '')
			.replace('<svg', `<svg x="${x}" y="${y}" width="${width}" height="${height}" opacity="${opacity || 1.0}"`);
		const replacement = innerSVG && innerSVG.replace(header, fixedHeader);
		result = result.replace(image, replacement);
	});

	return result;
}
