import { Command, Message } from '../../Client';
const convert = require('convert-units');

const units: Array<Record<'abbr' | 'measure' | 'system' | 'singular' | 'plural', string>> = convert().list();
const systems: Record<string, typeof units> = {};

units.forEach(unit => {
	if (!systems[unit.measure]) systems[unit.measure] = [];
	systems[unit.measure].push(unit);
});

const callback = async (msg: Message, args: string[]) => {
	if (!args.length || args[0].toLowerCase() === 'list') {
		const pages = Object.keys(systems).map(key => {
			return msg.client
				.newEmbed('BASIC')
				.setAuthor('Units', msg.author.displayAvatarURL({ dynamic: true }))
				.setTitle(key.split(/[A-Z]/).join('_').toTitleCase())
				.setDescription(systems[key].map(val => `\`${val.abbr}\` | ${val.plural}`).join('\n'));
		});

		pages.unshift(
			msg.client
				.newEmbed('BASIC')
				.setAuthor('Units', msg.author.displayAvatarURL({ dynamic: true }))
				.setTitle('Index')
				.setDescription(('1 | You are here ;)\n' + pages.map((p, i) => `${i + 2} | ${p.title}`).join('\n')).toCodeblock('md'))
		);

		return msg.client.pagination.create(msg, pages);
	} else if (args.length < 3)
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return msg.client.helpers.wrongSyntax(msg, `You only provided ${args.length} arguments, but this command requires ${command.args}!`);

	try {
		const num = parseFloat(args[0]);
		if (!num) return msg.client.helpers.wrongSyntax(msg, `${num} is not a valid number.`);

		const src = units.find(unit => Object.values(unit).some(val => val.toLowerCase() === args[1].toLowerCase()));
		if (!src) return msg.client.helpers.wrongSyntax(msg, `${args[1]} is not a valid unit.`);

		const dest = units.find(unit => Object.values(unit).some(val => val.toLowerCase() === args[2].toLowerCase()));
		if (!dest) return msg.client.helpers.wrongSyntax(msg, `${args[2]} is not a valid unit.`);

		const result = convert(num).from(src.abbr).to(dest.abbr);

		const embed = msg.client
			.newEmbed('BASIC')
			.setAuthor(src.measure.toTitleCase(), msg.author.displayAvatarURL({ dynamic: true }))
			.addFields([
				{
					name: `Input (${src.system})`,
					value: `${num.toFixed(2)} ${src.abbr}`,
					inline: true
				},
				{
					name: `Output (${dest.system})`,
					value: `${result.toFixed(2)} ${dest.abbr}`,
					inline: true
				}
			]);

		return msg.channel.send(msg.author, embed);
	} catch (error) {
		msg.channel.send(`Something went wrong. Please try again`);
	}
};

export const command: Command = {
	aliases: [],
	description: 'Convert from one unit to another',
	usage: '<list> OR <amount> <input unit> <output unit>',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
