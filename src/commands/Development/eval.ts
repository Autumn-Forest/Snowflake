import { Message, Command } from '../../Client';
import { inspect } from 'util';
import { Stopwatch } from '@klasa/stopwatch';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	// @ts-ignore
	const [message, client, commands, database, guild, channel] = [msg, msg.client, msg.client.commands, msg.client.database, msg.guild, msg.channel];

	// Remove leading and ending white spaces
	let content = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '');

	// Remove code-blocks
	if (content.startsWith('```') && content.endsWith('```')) {
		content = content.substring(3, content.length - 3);
		if (content.startsWith('js') || content.startsWith('ts')) content = content.substr(2);
	}

	// Create a dummy console
	const console: any = {
		_lines: [],
		_logger(...things: string[]) {
			this._lines.push(...things.join(' ').split('\n'));
		},
		_formatLines() {
			return this._lines.join('\n');
		}
	};
	console.log = console.error = console.warn = console.info = console._logger.bind(console);

	const stopwatch = new Stopwatch();
	let result, syncTime, asyncTime, promise;

	try {
		result = eval(content);
		syncTime = stopwatch.toString();
		// Is promise?
		if (result && typeof result.then === 'function') {
			promise = true;
			stopwatch.restart();
			result = await result;
			asyncTime = stopwatch.toString();
		}
	} catch (err) {
		if (!syncTime) syncTime = stopwatch.toString();
		if (promise && !asyncTime) asyncTime = stopwatch.toString();
		result = err;
	}

	stopwatch.stop();

	if (!result) result = 'No output...';

	if (typeof result !== 'string') result = inspect(result);

	const consoleOutput = console._formatLines();
	let response = stripIndents`
		${msg.client.helpers.codeBlock(result)}
		${msg.client.helpers.codeBlock(asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`)}
	`;
	if (consoleOutput) response += `\nConsole Output:${msg.client.helpers.codeBlock(consoleOutput)}`;

	if (response.length > 2000)
		response =
			(await msg.client.helpers.uploadHaste(result)) + '\n\n' + msg.client.helpers.codeBlock(asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`);

	return msg.channel.send(response);
};

export const command: Command = {
	name: 'eval',
	category: 'Dev',
	aliases: ['ev'],
	description: 'Eval script',
	usage: '',
	devOnly: true,
	nsfw: false,
	guildOnly: false,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};
