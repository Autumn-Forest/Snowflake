/* eslint-disable @typescript-eslint/no-use-before-define */
import { Message } from '..';
import { Collection, MessageEmbed, MessageReaction, User } from 'discord.js';

export default class Pagination {
	/**
	 * A collection of all messages requiring pagination, mapped by their messageID
	 */
	private static pages: Collection<string, Page> = new Collection();
	private static defaultEmojis = ['⏮️', '⬅️', '⏹️', '🔢', '➡️', '⏭️'];
	/**
	 * Create a multi page embed
	 * @param message The message that called the command that initialises this. **This will automatically send the first page as message!**
	 * @param embeds An Array of all embeds. A footer displaying the current page will be added to all embeds
	 * @param initPage If this is supplied, send this page instead of the first page
	 * @param customEmojis If this is supplied, use these emojis for pagination instead. Must have same length as the embed array! **Must be only the id (or name for unicode)!**
	 */
	static async create(message: Message, embeds: Array<MessageEmbed>, initPage = 0, customEmojis?: Array<string>) {
		if (embeds.length < 2) throw new Error('Too little pages provided!');
		if (embeds.length < initPage + 1) throw new Error('InitPage out of range!');
		if (customEmojis && customEmojis.length !== embeds.length) throw new Error(`${customEmojis.length} emojis but ${embeds.length} pages provided!`);

		embeds.forEach((e, i) => e.setFooter(`Page ${i + 1}/${embeds.length}`));

		const msg = (await message.channel.send(message.client.constants.emojis.loading, embeds[initPage])) as Message;
		const success = await Promise.all((customEmojis || this.defaultEmojis).map(r => msg.react(r)))
			.then(() => msg.edit(embeds[initPage]))
			.catch(() => null);

		if (!success) {
			msg.delete().catch(() => null);
			return message.client.helpers.wrongSyntax(message, 'Sorry, something went wrong and I was not able to initialise the multi pages menu!');
		}

		this.pages.set(msg.id, {
			pages: embeds,
			currentPage: initPage,
			user: message.author.id,
			msg: msg,
			trigger: message,
			customEmojis: customEmojis
		});
		return msg;
	}

	/**
	 * Delete a multi page embed
	 * @param msg The message of this multi page embed
	 * */
	static delete(msg: Message) {
		const pagination = this.pages.get(msg.id);
		if (!pagination) return false;

		if (pagination.msg.deletable) pagination.msg.delete().catch(() => null);
		this.pages.delete(msg.id);

		return true;
	}

	/**
	 * Function to toggle pages. This should never be called from outside the messageReactionAdd event
	 * @param reaction The reaction
	 * @param user The user
	 */
	static async browse(reaction: MessageReaction, user: User) {
		const msg = reaction.message as Message;
		const pagination = this.pages.get(msg.id);
		if (
			!pagination ||
			pagination.user !== user.id ||
			!(pagination.customEmojis || this.defaultEmojis).some(r => reaction.emoji.name === r || reaction.emoji.id === r)
		)
			return;

		reaction.users.remove(user).catch(() => null);

		if (pagination.customEmojis) {
			if (pagination.currentPage === pagination.customEmojis.indexOf(reaction.emoji.id || reaction.emoji.name)) return;
			pagination.currentPage = pagination.customEmojis.indexOf(reaction.emoji.id || reaction.emoji.name);
		} else
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
				case '🔢':
					const prompt = new msg.client.prompt(pagination.trigger);
					const page = await prompt.message(
						`Which page would you like to jump to?`,
						pagination.pages.map((_p, i) => (i + 1).toString()),
						`{VALUE} is not a valid page! Please try again`
					);
					if (!page) return;
					prompt.delete();

					pagination.currentPage = parseInt(page) - 2;
				case '➡️':
					if (pagination.currentPage === pagination.pages.length - 1) return;
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
	trigger: Message;
	customEmojis?: Array<string>;
}
