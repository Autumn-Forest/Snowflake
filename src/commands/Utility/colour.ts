import { Command, Message } from '../../Client';
import tiny from 'tinycolor2';
import { stripIndents } from 'common-tags';
import Canvas from 'canvas';

const callback = async (msg: Message, args: string[]) => {
	const colour = args.length ? tiny(args[0]) : tiny.random();

	if (!colour.isValid()) return msg.client.helpers.wrongSyntax(msg, `That's not a valid colour!`);

	const canvas = Canvas.createCanvas(400, 400);
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = colour.toHexString();
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const name = colour.toName() || 'Colour';
	const attachmentName = name.toTitleCase() + '.png';

	const embed = msg.client
		.newEmbed('INFO')
		.setTitle(name.toTitleCase())
		.attachFiles([{ name: attachmentName, attachment: await canvas.toBuffer('image/png') }])
		.setImage('attachment://' + attachmentName)
		.setDescription(
			stripIndents`
			• Hex: ${colour.toHexString()}
			• RGB: ${colour.toRgbString()}
			• HSV: ${colour.toHsvString()}
			• HSL: ${colour.toHslString()}
			• Brightness: ${colour.getBrightness().toFixed(1)}
			`
		);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['color', 'c', 'colorinfo', 'colourinfo'],
	description: 'Check a colour',
	usage: '[Colour Resolvable] (defaults to random colour)',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
