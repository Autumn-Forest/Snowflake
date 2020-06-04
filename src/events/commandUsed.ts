import { Client, Message, Command } from '../Client';
import { User } from 'discord.bio';
import { MessageReaction } from 'discord.js';

export const listener = async (client: Client, msg: Message, _command: Command, res: Message | void) => {
	const s = await msg.client.cache.getGuild(msg);
	if (s?.settings.deleteCommandTriggers) msg.delete({ timeout: 1000 }).catch(() => null);

	if (res) {
		const t = client.constants.emojis.trash;

		let success = true;
		res.react(t).catch(() => (success = false));
		if (!success) return;

		const reacted = await res.awaitReactions((r: MessageReaction, u: User) => u.id === msg.author.id && r.emoji.name === t, {
			time: 10 * 1000,
			max: 1
		});

		if (reacted.size) {
			if (res.deletable) res.delete({ reason: 'Cancelled by user' }).catch(() => null);
			if (msg.deletable) msg.delete({ reason: 'Cancelled by user' }).catch(() => null);
		} else res.reactions.cache.get(t)?.users.remove(client.user!.id);
	}
};
