import { Client, Message } from '..';
import { TextChannel, DMChannel, NewsChannel, User, MessageEmbed, GuildEmoji, ReactionEmoji, MessageReaction } from 'discord.js';

export default class PromptManager {
	readonly client: Client;
	readonly channel: TextChannel | NewsChannel | DMChannel;
	readonly user: User;
	trigger: Message;
	msg?: Message;
	embed: MessageEmbed;

	constructor(msg: Message) {
		this.client = msg.client as Client;
		this.trigger = msg;
		this.channel = msg.channel;
		this.user = msg.author;
		this.embed = msg.client
			.newEmbed('BASIC')
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setFooter('Type quit to cancel anytime.');
	}

	private async sendQuestion(question: string) {
		if (!this.msg) this.msg = (await this.channel.send(this.embed.setDescription(question))) as Message;
		else this.msg.edit(this.embed.setDescription(question));
	}

	/**
	 * Delete the prompt
	 */
	delete() {
		this.client.prompts.delete(this.user.id);
		if (this.msg?.deletable) this.msg?.delete();
	}
	/**
	 * Prompts for user input
	 * @param question The Question to send.
	 * @param options An array of accepted choices or a RegEx. Provide an empty array if anything is accepted
	 * @param error A custom error message when invalid input is provided. `{VALUE}` will be replaced with their invalid choice
	 * @param timeout The prompt timeout (in min)
	 * @returns The user choice (string)
	 */
	async message(question: string, options: string[] | RegExp, error?: string, timeout = this.client.promptTimeout, initial = true): Promise<string | void> {
		if (this.client.prompts.get(this.user.id)) return this.client.helpers.wrongSyntax(this.trigger, 'You already have another prompt open!');
		else this.client.prompts.set(this.user.id, this.channel.id);

		if (initial) this.sendQuestion(question);

		const input = (await this.channel.awaitMessages((msg: Message) => msg.author.id === this.user.id, { max: 1, time: 1000 * 60 * timeout })).first();

		this.client.prompts.delete(this.user.id);

		if (!input) {
			this.delete();
			return this.client.helpers.wrongSyntax(this.trigger, 'The prompt timed out!');
		}

		if (input.deletable) input.delete({ timeout: 1000 }).catch(() => null);

		if ('quit'.startsWith(input.content.toLowerCase())) return this.client.helpers.wrongSyntax(this.trigger, 'Successfully cancelled the prompt!');

		if (options instanceof RegExp && options.test(input.content)) return input.content;
		else if (options instanceof Array && (!options.length || options.indexOf(input.content) !== -1)) return input.content;

		this.sendQuestion((error?.substitute({ VALUE: input.content }) || `\`${input.content}\` is not a valid choice! Please try again.`) + `\n\n${question}`);
		return this.message(question, options, error, timeout, false);
	}

	/**
	 * @param question The Question to send
	 * @param options An array of accepted choices or a RegEx. Provide an empty array if anything is accepted
	 * @param react Whether to react with all options (Only works if options is array)
	 * @param error A custom error message when invalid input is provided
	 * @param timeout The prompt timeout (in min)
	 * @returns The user choice (emoji object)
	 */
	async reaction(
		question: string,
		options: string[] | RegExp,
		react?: boolean,
		error?: string,
		timeout = this.client.promptTimeout,
		initial = true
	): Promise<GuildEmoji | ReactionEmoji | void> {
		if (this.client.prompts.get(this.user.id)) return this.client.helpers.wrongSyntax(this.trigger, 'You already have another prompt open!');
		else this.client.prompts.set(this.user.id, this.channel.id);

		if (initial) await this.sendQuestion(question);
		if (react && options instanceof Array) await Promise.all(options.map(r => this.msg?.react(r)));

		const input = (await this.msg!.awaitReactions((_r: MessageReaction, u: User) => u.id === this.user.id, { max: 1, time: 1000 * 60 * timeout })).first();

		this.client.prompts.delete(this.user.id);

		if (!input) {
			this.delete();
			return this.client.helpers.wrongSyntax(this.trigger, 'The prompt timed out!');
		}

		if (options instanceof RegExp && options.test(input.emoji.name)) return input.emoji;
		else if (options instanceof Array && (!options.length || options.indexOf(input.emoji.id || input.emoji.name) !== -1)) return input.emoji;

		this.sendQuestion((error || `That is not a valid choice! Please try again.`) + `\n\n${question}`);
		return this.reaction(question, options, react, error, timeout, false);
	}

	async chooseOne<T>(question: string, choices: Array<T>): Promise<T | void> {
		const choice = await this.message(
			question +
				choices
					.map((c, i) => `${i + 1} | ${c}`)
					.join('\n')
					.toCodeblock('css'),
			choices.map((_, i) => (i + 1).toString()),
			'`{VALUE}` is not a valid option! Please try again.'
		);

		if (!choice) return;

		const result = choices[parseInt(choice) - 1];
		return result;
	}
}
