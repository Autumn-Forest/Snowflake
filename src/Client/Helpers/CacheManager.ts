import { Client, Message } from '..';
import { Collection, GuildMember, User } from 'discord.js';
import { GuildSettings } from '../../database/schemas/GuildSettings';
import { UserSettings } from '../../database/schemas/UserSettings';

export class CacheManager {
	constructor(client: Client) {
		this.client = client;
	}

	private readonly client: Client;
	private guildCache: Collection<string, GuildSettings> = new Collection();
	private userCache: Collection<string, UserSettings> = new Collection();
	private flushQueue: Collection<string, NodeJS.Timeout> = new Collection();

	get size() {
		return this.guildCache.size + this.userCache.size;
	}

	async getGuild(identifier: Message | GuildMember, flush = false, id?: string) {
		id = id || identifier.guild?.id!;

		if (flush) this.flush('Guild', id);

		let cache = this.guildCache.get(id);
		if (!cache) {
			cache = (await this.client.database.guildSettings.findOne({ guild: id })) || (await this.client.database.guildSettings.create({ guild: id }));
			this.guildCache.set(id, cache);
		}

		this.flushQueue.delete(id);
		this.flushQueue.set(
			id,
			setTimeout(() => this.flush('Guild', id), this.client.flushTime)
		);
		return cache;
	}

	async getUser(user: User, flush = false, id?: string) {
		id = id || user.id;

		if (flush) this.flush('User', id);

		let cache = this.userCache.get(id);
		if (!cache) {
			cache = (await this.client.database.userSettings.findOne({ user: id })) || (await this.client.database.userSettings.create({ user: id }));
			this.userCache.set(id, cache);
		}

		this.flushQueue.delete(id);
		this.flushQueue.set(
			id,
			setTimeout(() => this.flush('User', id), this.client.flushTime)
		);
		return cache;
	}

	flush(cacheType?: 'User' | 'Guild', id?: string) {
		if (cacheType === 'User') {
			if (id) this.userCache.delete(id);
			else this.userCache = new Collection();
		}
		if (cacheType === 'Guild') {
			if (id) this.guildCache.delete(id);
			else this.guildCache = new Collection();
		} else {
			this.guildCache = new Collection();
			this.userCache = new Collection();
		}
	}
}
