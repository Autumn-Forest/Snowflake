import { Command, Message } from '../../Client';
import { AllowedImageFormat, ImageSize } from 'discord.js';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	if (!msg.guild.icon) return msg.client.helpers.wrongSyntax(msg, 'This Server does not have an icon!');

	const formats: AllowedImageFormat[] = ['webp', 'png', 'jpg', 'jpeg'];
	if (msg.guild.iconURL({ dynamic: true })?.includes('gif')) formats.push('gif');

	const sizes: ImageSize[] = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

	const embed = msg.client
		.newEmbed('INFO')
		.setTitle('Server Icon')
		.setImage(msg.guild.iconURL({ size: 2048, dynamic: true })!)
		.setDescription(
			stripIndents`
			${formats.map(f => `[${f}](${msg.guild.iconURL({ size: 2048, format: f })})`).join(' | ')}
			${sizes.map(s => `[${s}](${msg.guild.iconURL({ size: s, dynamic: true })})`).join(' | ')}
			`
		);
	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['guildicon', 'serverlogo', 'icon'],
	description: 'View the server icon',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: true,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
