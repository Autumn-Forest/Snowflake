import Util from './util';
import { Collection, Snowflake, Role, User, GuildMember } from 'discord.js';
import { Message } from '../../Client';

export default class Getters extends Util {
	static async getUser(message: Message, args: string[], spot?: number) {
		if (message.guild) {
			const member = await this.getMember(message, args);
			return member ? member.user : void 0;
		}

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const user = message.mentions.users?.first() || (await message.client.users.fetch(input).catch(() => null));
		if (user) return user;

		const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

		if (userSearch.size === 0) {
			return Util.wrongSyntax(message, 'You did not provide a valid user. Please run the command again and provide one.');
		} else if (userSearch.size === 1) {
			return userSearch.first();
		} else if (userSearch.size < 11) {
			return await this.chooseOne(message, userSearch);
		} else {
			return Util.wrongSyntax(message, `I found multiple users matching your input: ${userSearch.size}`);
		}
	}

	static async getMember(message: Message, args: string[], spot?: number, silentError?: boolean) {
		if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

		const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const member = message.mentions.members?.first() || (await message.guild.members.fetch(input).catch(() => null));
		if (member) return member;

		const memberSearch = message.guild.members.cache.filter(
			member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
		);

		if (memberSearch.size === 0) {
			if (silentError === true) return;
			else return Util.wrongSyntax(message, 'You did not provide a valid member. Please run the command again and provide one.');
		} else if (memberSearch.size === 1) {
			return memberSearch.first();
		} else if (memberSearch.size < 11) {
			return await this.chooseOne(message, memberSearch);
		} else {
			return Util.wrongSyntax(message, `I found multiple users matching your input: ${memberSearch.size}`);
		}
	}

	static async getRole(message: Message, args: string[], spot?: number) {
		if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
		if (role) return role;

		const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

		if (roleSearch.size === 0) {
			return Util.wrongSyntax(message, 'You did not provide a valid role. Please run the command again and provide one.');
		} else if (roleSearch.size === 1) {
			return roleSearch.first();
		} else if (roleSearch.size < 11) {
			return await this.chooseOne(message, roleSearch);
		} else {
			return Util.wrongSyntax(message, `I found multiple roles matching your input: ${roleSearch.size}`);
		}
	}

	static getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

	private static chooseOne(message: Message, choices: Collection<Snowflake, Role>): Promise<Role | void>;
	private static chooseOne(message: Message, choices: Collection<Snowflake, User>): Promise<User | void>;
	private static chooseOne(message: Message, choices: Collection<Snowflake, GuildMember>): Promise<GuildMember | void>;
	private static async chooseOne(message: Message, choices: Collection<Snowflake, Role | User | GuildMember>) {
		const options = choices.array().map((c, i) => {
			return { index: i + 1, choice: c };
		});

		const prompt = new message.client.prompt(message);
		const choice = await prompt.message(
			'I found multiple targets. Please select one from below by typing only the number!' +
				options
					.map(o => `${o.index} | ${this.getName(o.choice)}`)
					.join('\n')
					.toCodeblock('css'),
			options.map(o => o.index.toString()),
			'That was not a valid option! Please try again.'
		);
		prompt.delete();

		if (!choice) return Util.wrongSyntax(message, 'I found multiple matches but the prompt to select one ran out. Please run the command again!');

		const result = options.find(o => o.index === parseInt(choice));
		if (!result) return;

		return result.choice;
	}
}
