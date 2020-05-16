import { Message, Command } from '../../Client';
import { MessageEmbed } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	// @ts-ignore
	const [client, commands, database, guild, channel] = [msg.client, msg.client.commands, msg.client.database, msg.guild, msg.channel];

	const embed = new MessageEmbed()
		.setColor(msg.client.colours.BASIC)
		.setTimestamp()
		.setAuthor('eval', msg.client.user!.displayAvatarURL())
		.addField('Input', msg.client.helpers.util.codeBlock(msg.client.helpers.util.trimString(args.join(' '), 1024), 'js'));

	try {
		let output = await eval(args.join(' '));

		if (typeof output !== 'string') output = require('util').inspect(output);
		if (output.length > 2000) return sendOutput(msg, embed, await client.helpers.util.uploadHaste(msg.client.redactCredentials(output)));

		return sendOutput(msg, embed, output);
	} catch (err) {
		if (typeof err !== 'string') err = require('util').inspect(err);
		return sendOutput(msg, embed, err);
	}
};

export const command: Command = {
	name: 'eval',
	category: 'Dev',
	aliases: [],
	usage: '',
	devOnly: true,
	nsfw: false,
	guildOnly: false,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

const sendOutput = (msg: Message, embed: MessageEmbed, text: string) => {
	msg.channel.send(
		embed.addField('Output', msg.client.helpers.util.codeBlock(msg.client.helpers.util.trimString(msg.client.redactCredentials(text), 1024), 'js'))
	);
};
