import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const all = await msg.client.helpers.fetch('https://srhpyqt94yxb.statuspage.io/api/v2/summary.json').catch(() => null);
	if (!all) return msg.client.helpers.wrongSyntax(msg, "An error happened while trying to join statuspage.io's api.");
	const embed = msg.client.newEmbed('INFO').setTitle(all.status.description).setURL('https://discordstatus.com');
	const description = [];
	all.components = all.components.filter((item: { [key: string]: string }) => item.group_id === 'jk03xttfcz9b');
	for (const component of all.components) {
		description.push(
			`${component.status === 'operational' ? msg.client.constants.emojis.success : msg.client.constants.emojis.fail} **${
				component.name
			}:** ${component.status.replace(/_/g, ' ')}`
		);
	}
	embed.setDescription(description.join('\n'));
	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['voicestatus', 'voice', 'discordvoice', 'voicediscord', 'statusvoice'],
	description: "Get the current status of Discord's voices servers (if avalaible)",
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS', 'SEND_MESSAGES'],
	callback: callback
};
