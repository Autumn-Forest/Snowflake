import { GuildMember, User, Collection } from 'discord.js';
import { FullCommand } from '../';

export default class Cooldowns {
	private static cooldowns: Collection<string, Collection<string, number>> = new Collection();

	static get(id: string | User | GuildMember, command: FullCommand) {
		if (typeof id !== 'string') id = id.id;

		if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());

		const now = Date.now();

		const cooldownAmount = command.cooldown * 1000;

		const userCooldown = this.cooldowns.get(command.name)!.get(id);
		if (!userCooldown) return false;

		const expirationTime = userCooldown + cooldownAmount;

		if (now < expirationTime) return (expirationTime - now) / 1000;
		else return false;
	}

	static add(id: string | User | GuildMember, command: FullCommand) {
		if (typeof id !== 'string') id = id.id;

		if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());

		const timestamps = this.cooldowns.get(command.name)!;

		timestamps.set(id, Date.now());
	}
}
