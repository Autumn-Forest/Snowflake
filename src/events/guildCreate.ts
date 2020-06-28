import { Client } from '../Client';
import { Guild } from 'discord.js';
import { stripIndents } from 'common-tags';

export const listener = (client: Client, guild: Guild) => {
	const channel = client.getChannel('info');
	const embed = client
		.newEmbed('INFO')
		.setTitle('I was added to a guild!')
		.setDescription(
			stripIndents`
        		**Guild:** ${guild.name} - ${guild.id}
        		**Owner:** ${guild.owner?.user.tag} - ${guild.ownerID}
				**Members:** ${guild.memberCount}
				`
		);
	return channel.send(embed);
};
