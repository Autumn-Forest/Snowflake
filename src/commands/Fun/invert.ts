import { Command, Message } from '../../Client';
import Canvas from 'canvas';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length && args[0].toLowerCase() !== 'server' ? await msg.client.helpers.getUser(msg, args) : msg.author;
	if (!user) return;

	const iconURL =
		args[0]?.toLowerCase() === 'server' && msg.guild
			? msg.guild.iconURL({ format: 'png', size: 512 })
			: user.displayAvatarURL({ format: 'png', size: 512 });

	if (!iconURL) return msg.client.helpers.wrongSyntax(msg, 'The user or guild does not have an icon!');

	const img = await Canvas.loadImage(iconURL);

	const canvas = Canvas.createCanvas(img.height, img.width);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	const imageData = ctx.getImageData(0, 0, img.height, img.width);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
		// red
		data[i] = 255 - data[i];
		// green
		data[i + 1] = 255 - data[i + 1];
		// blue
		data[i + 2] = 255 - data[i + 2];
	}

	ctx.putImageData(imageData, 0, 0);

	return msg.channel.send({ files: [canvas.toBuffer()] });
};

export const command: Command = {
	name: 'invert',
	category: 'Fun',
	aliases: ['negate'],
	description: 'Invert your profile picture',
	usage: '[User | "Server"]',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['ATTACH_FILES'],
	callback: callback
};
