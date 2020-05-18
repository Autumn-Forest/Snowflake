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

		const msg = await message.reply(`\`\`\`${options.map(o => `${o.index} | ${this.getName(o.choice)}`).join('\n')}\`\`\``);

		const choice = (
			await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 1000 * 30, errors: ['time'] }).catch(() => null)
		)?.first();

		if (!choice) return this.wrongSyntax(message, 'I found multiple matches but the prompt to select one ran out. Please run the command again!');

		const result = options.find(o => o.index === parseInt(choice.content));
		if (!result) this.wrongSyntax(message, 'That was not a valid choice! Please run the command again.');

		msg.delete().catch(() => null);
		choice.delete().catch(() => null);

		return result?.choice;
	};

	getStrings = async () => {
		// const guildSettings = await message.client.getSettings(message);
		const strings = 'en_GB';
		return strings;
	}; // Add the functions here
}

/*import { wrongSyntax } from './Util';
import { Message } from '../Client';
import { Collection, Snowflake, Role, User, GuildMember } from 'discord.js';

export const getUser = async (message: Message, args: string[], spot?: number) => {
    if (message.guild) return (await getMember(message, args))?.user;

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const user = message.mentions.users?.first() || message.client.users.cache.get(input) || (await message.client.users.fetch(input).catch(() => null));
    if (user) return user;

    const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

    if (userSearch.size === 0) {
        wrongSyntax(message, 'NO_USER_FOUND');
        return null;
    } else if (userSearch.size === 1) {
        return userSearch.first();
    } else if (userSearch.size < 11) {
        return (await chooseOne(message, userSearch, errors)) as User;
    } else {
        wrongSyntax(message, `${'MULTIPLE_USERS_FOUND'}: ${userSearch.size}`, false);
        return null;
    }
};

export const getMember = async (message: Message, args: string[], spot?: number) => {
    if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

    const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const member = message.mentions.members?.first() || message.guild.members.cache.get(input) || (await message.guild.members.fetch(input).catch(() => null));
    if (member) return member;

    const memberSearch = message.guild.members.cache.filter(
        member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
    );

    if (memberSearch.size === 0) {
        wrongSyntax(message, 'NO_MEMBER_FOUND');
        return null;
    } else if (memberSearch.size === 1) {
        return memberSearch.first();
    } else if (memberSearch.size < 11) {
        return (await chooseOne(message, memberSearch, errors)) as GuildMember;
    } else {
        wrongSyntax(message, `${errors.MULTIPLE_MEMBERS_FOUND}: ${memberSearch.size}`, false);
        return null;
    }
};

export const getRole = async (message: Message, args: string[], spot?: number) => {
    if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
    if (role) return role;

    const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

    if (roleSearch.size === 0) {
        wrongSyntax(message, errors.NO_ROLE_FOUND);
        return null;
    } else if (roleSearch.size === 1) {
        return roleSearch.first();
    } else if (roleSearch.size < 11) {
        return (await chooseOne(message, roleSearch, errors)) as Role;
    } else {
        wrongSyntax(message, `${errors.MULTIPLE_ROLES_FOUND}: ${roleSearch.size}`, false);
        return null;
    }
};

const getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

export const chooseOne = async (message: Message, choices: Collection<Snowflake, Role | User | GuildMember>, strings: VenusCommandStrings) => {
    let i = 0;
    const options = choices.map(choice => {
        return { index: ++i, choice: choice };
    });

    const msg = await message.reply(`${strings.PROMPT}\`\`\`${options.map(o => `${o.index} | ${getName(o.choice)}`).join('\n')}\`\`\``);

    const choice = (
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 1000 * 30, errors: ['time'] }).catch(() => null)
    )?.first();

    if (!choice) return wrongSyntax(message, strings.PROMPT_TIMEOUT, false);

    const result = options.find(o => o.index === parseInt(choice.content));
    if (!result) wrongSyntax(message, strings.INVALID_CHOICE, false);

    msg.delete().catch(() => null);
    choice.delete().catch(() => null);

    return result?.choice;
};

export const getStrings = async (message: Message) => {
    const guildSettings = await message.client.getSettings(message);
    const strings = message.client.languages.get(guildSettings?.settings.language || 'en_GB');
    return strings;
};
*/
