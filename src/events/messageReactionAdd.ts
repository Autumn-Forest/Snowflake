import { Client } from '../Client';
import { MessageReaction, User } from 'discord.js';

export const listener = async (client: Client, reaction: MessageReaction, user: User) => {
	if (reaction.partial) reaction = (await reaction.fetch().catch(() => null)) as MessageReaction;
	if (!reaction) return;

	client.pagination.browse(reaction, user);
};
