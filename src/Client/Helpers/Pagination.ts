import { Message } from '..';
import { Collection, MessageEmbed, MessageReaction, User } from 'discord.js';

export default class Pagination {
	/**
	 * A collection of all messages requiring pagination, mapped by their messageID
	 */
	private static pages: Collection<string, Page> = new Collection();

	static async add(message: Message, embeds: Array<MessageEmbed>, initPage = 0) {
		if (embeds.length < 2) throw new Error('1 or 0 pages provided!');
		if (embeds.length < initPage) throw new Error('InitPage out of range!');

		embeds.forEach((e, i) => e.setFooter(`Page ${i + 1}/${embeds.length}`));

		const msg = (await message.channel.send(embeds[initPage])) as Message;
		const success = await Promise.all(['⏮️', '⬅️', '⏹️', '➡️', '⏭️'].map(r => msg.react(r))).catch(() => null);
		if (!success) return message.client.helpers.wrongSyntax(message, 'Sorry, something went wrong and I was not able to initialise the multi pages menu!');

		this.pages.set(msg.id, {
			pages: embeds,
			currentPage: 0,
			user: message.author.id,
			msg: msg
		});
		return msg;
	}

	static delete(msg: Message) {
		const pagination = this.pages.get(msg.id);
		if (!pagination) return false;

		if (pagination.msg.deletable) pagination.msg.delete().catch(() => null);
		this.pages.delete(msg.id);

		return true;
	}

	static browse(reaction: MessageReaction, user: User) {
		if (!['⏮️', '⬅️', '⏹️', '➡️', '⏭️'].some(r => reaction.emoji.name === r)) return;

		const msg = reaction.message as Message;
		const pagination = this.pages.get(msg.id);
		if (!pagination || pagination.user !== user.id) return;

		reaction.users.remove(user);

		switch (reaction.emoji.name) {
			case '⏮️':
				if (pagination.currentPage === 0) return;
				pagination.currentPage = 0;

				break;
			case '⬅️':
				if (pagination.currentPage === 0) return;
				pagination.currentPage -= 1;
				break;
			case '⏹️':
				this.delete(msg);
				break;
			case '➡️':
				if (pagination.currentPage === pagination.pages.length) return;
				pagination.currentPage += 1;
				break;
			case '⏭️':
				if (pagination.currentPage === pagination.pages.length - 1) return;
				pagination.currentPage = pagination.pages.length - 1;
				break;
		}
		pagination.msg.edit(pagination.pages[pagination.currentPage]).catch(() => this.handleError(pagination, msg.id));
	}

	static handleError(page: Page, id: string) {
		if (page.msg.deletable) page.msg.delete().catch(() => null);
		this.pages.delete(id);
	}
}

interface Page {
	pages: Array<MessageEmbed>;
	currentPage: number;
	user: string;
	msg: Message;
}
