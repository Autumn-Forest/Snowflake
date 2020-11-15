import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const all = await msg.client.helpers.fetch('https://srhpyqt94yxb.statuspage.io/api/v2/summary.json').catch(() => null);
	const incidents = await msg.client.helpers.fetch('https://srhpyqt94yxb.statuspage.io/api/v2/incidents.json').catch(() => null);

	if (!all) return msg.client.helpers.wrongSyntax(msg, "An error happened while trying to join statuspage.io's api.");
	const embed = msg.client.newEmbed('INFO').setTitle(all.status.description).setURL('https://discordstatus.com');
	const description = [];
	all.components = all.components.filter((item: { [key: string]: string }) => item.group_id !== 'jk03xttfcz9b' && item.id !== 'ghlgk5p8wyt7');
	for (const component of all.components) {
		description.push(
			`${component.status === 'operational' ? msg.client.constants.emojis.success : msg.client.constants.emojis.fail} **${
				component.name
			}:** ${component.status.replace(/_/g, ' ')}`
		);
	}
	embed.setDescription(description.join('\n'));
	embed.addField('Latest Incident', `[${incidents.incidents[0].name}](${incidents.incidents[0].shortlink}) (${incidents.incidents[0].status})`);
	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['status', 'discord'],
	description: "Get the current status of Discord's servers (if avalaible)",
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: ['EMBED_LINKS', 'SEND_MESSAGES'],
	callback: callback
};
