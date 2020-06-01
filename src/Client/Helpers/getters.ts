import { Util } from './util';
import { Collection, Snowflake, Role, User, GuildMember } from 'discord.js';
import { Message } from '../../Client';

export class Getters extends Util {
	getUser = async (message: Message, args: string[], spot?: number) => {
		if (message.guild) return (await this.getMember(message, args))?.user;

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const user = message.mentions.users?.first() || message.client.users.cache.get(input) || (await message.client.users.fetch(input).catch(() => null));
		if (user) return user;

		const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

		if (userSearch.size === 0) {
			this.wrongSyntax(message, 'You did not provide a valid user. Please run the command again and provide one.');
			return null;
		} else if (userSearch.size === 1) {
			return userSearch.first();
		} else if (userSearch.size < 11) {
			return (await this.chooseOne(message, userSearch)) as User;
		} else {
			this.wrongSyntax(message, `I found multiple users matching your input: ${userSearch.size}`);
			return null;
		}
	};

	getMember = async (message: Message, args: string[], spot?: number) => {
		if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

		const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const member =
			message.mentions.members?.first() || message.guild.members.cache.get(input) || (await message.guild.members.fetch(input).catch(() => null));
		if (member) return member;

		const memberSearch = message.guild.members.cache.filter(
			member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
		);

		if (memberSearch.size === 0) {
			this.wrongSyntax(message, 'You did not provide a valid member. Please run the command again and provide one.');
			return null;
		} else if (memberSearch.size === 1) {
			return memberSearch.first();
		} else if (memberSearch.size < 11) {
			return (await this.chooseOne(message, memberSearch)) as GuildMember;
		} else {
			this.wrongSyntax(message, `I found multiple users matching your input: ${memberSearch.size}`);
			return null;
		}
	};

	getRole = async (message: Message, args: string[], spot?: number) => {
		if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
		if (role) return role;

		const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

		if (roleSearch.size === 0) {
			this.wrongSyntax(message, 'You did not provide a valid role. Please run the command again and provide one.');
			return null;
		} else if (roleSearch.size === 1) {
			return roleSearch.first();
		} else if (roleSearch.size < 11) {
			return (await this.chooseOne(message, roleSearch)) as Role;
		} else {
			this.wrongSyntax(message, `I found multiple roles matching your input: ${roleSearch.size}`);
			return null;
		}
	};

	getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

	chooseOne = async (message: Message, choices: Collection<Snowflake, Role | User | GuildMember>) => {
		let i = 0;
		const options = choices.map(choice => {
			return { index: ++i, choice: choice };
		});

		const prompt = new this.client.prompt(message);
		const choice = await prompt.message(
			'I found multiple targets. Please select one from below by typing only the number!' +
				this.client.helpers.codeBlock(options.map(o => `${o.index} | ${this.getName(o.choice)}`).join('\n'), 'h'),
			options.map(o => o.index.toString()),
			'That was not a valid option! Please try again.'
		);
		prompt.delete();

		if (!choice) return this.wrongSyntax(message, 'I found multiple matches but the prompt to select one ran out. Please run the command again!');

		const result = options.find(o => o.index === parseInt(choice));
		if (!result) return;

		return result.choice;
	};
}
