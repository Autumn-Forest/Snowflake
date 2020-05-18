import { Client, Message, Command } from '../Client';

export const listener = async (_client: Client, msg: Message, _command: Command) => {
	const s = await msg.client.cache.getGuild(msg);
	if (s?.settings.deleteCommandTriggers) msg.delete({ timeout: 1000 }).catch(() => null);
};
