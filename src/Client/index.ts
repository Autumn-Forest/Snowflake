import { Client as BaseClient, Message as BaseMessage, Collection, GuildMember, TextChannel, MessageEmbed, User, Snowflake } from 'discord.js';
import { config } from '../config';
import constants from '../constants';
import { database } from '../database';
import { join } from 'path';
import { readdirSync } from 'fs';
import { Getters, Nekos, WebhookManager, PromptManager, CacheManager, Cooldowns, Pagination } from './Helpers';
import { stripIndents } from 'common-tags';
import { GuildMessage } from '../interfaces/GuildMessage';
import { ClientEvents, ClientOptions, FullCommand, RecentCommand } from './Interfaces';
export * from './Interfaces';

export interface Message extends BaseMessage {
	client: Client;
}

export class Client extends BaseClient {
	private _on = this.on;
	private _emit = this.emit;
	on = <K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this => this._on(event, listener);
	emit = <K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean => this._emit(event, ...args);

	settings = {
		debug: false,
		flushTime: 1000 * 60 * 30,
		promptTimeout: 3, // In minutes
		commandCooldown: 3, // In seconds
		colours: {
			ERROR: 'FF403C',
			INFO: '0D7DFF',
			BASIC: '75F1BD'
		}
	};

	config = config;
	constants = constants;
	database = database;
	commands: Collection<string, FullCommand> = new Collection();
	prompts: Collection<string, string> = new Collection();
	paths = {
		listeners: join(__dirname, '../events'),
		commands: join(__dirname, '../commands')
	};
	recentCommands: Collection<Snowflake, RecentCommand> = new Collection();
	activeCommands: Set<Snowflake> = new Set();
	cooldowns = Cooldowns;
	prompt = PromptManager;
	pagination = Pagination;
	helpers = Getters;
	nekos = new Nekos(this);
	webhooks = new WebhookManager(this);
	cache = new CacheManager(this);

	constructor(options?: ClientOptions) {
		super(options?.baseOptions);
		this.settings = { ...this.settings, ...options };
	}

	async start() {
		this.initCommands();
		this.initListeners();
		this.login(this.config.token);
	}

	initCommands() {
		let amount = 0;
		readdirSync(this.paths.commands).forEach(dir => {
			readdirSync(join(this.paths.commands, dir)).forEach(file => {
				const path = join(this.paths.commands, dir, file);
				const command: FullCommand = require(path).command;
				command.name = file.replace('.js', '');
				command.category = dir as any;
				if (!command.cooldown) command.cooldown = this.settings.commandCooldown;

				this.commands.set(command.name, command);
				delete require.cache[path];
				amount++;
			});
		});
		console.log(`Loaded ${amount} commands!`);
	}

	initListeners() {
		let amount = 0;
		readdirSync(this.paths.listeners).forEach(file => {
			const path = join(this.paths.listeners, file);
			const listener = require(path).listener;
			const listenerName = file.replace('.js', '');
			this.on(listenerName as any, listener.bind(null, this));
			delete require.cache[path];
			amount++;
		});
		this.on('error', this.handleError);
		console.log(`Loaded ${amount} listeners!`);
	}

	newEmbed(type?: 'INFO' | 'ERROR' | 'BASIC') {
		return new MessageEmbed().setTimestamp().setColor(type ? this.settings.colours[type] : 'RANDOM');
	}

	getChannel(channelType: 'info' | 'errors') {
		const channel = this.channels.cache.get(this.config.channels[channelType]);
		if (!channel || !(channel instanceof TextChannel)) {
			console.log(`Invalid ${channelType}-channel provided or not reachable.`);
			process.exit(1);
		}
		return channel;
	}

	redactCredentials(text: string) {
		return text.replace(this.config.token, '[REDACTED]').replace(this.config.mongoString, '[REDACTED]');
	}

	/*
		Functions written like ^ bind the caller as this, 
		so if they were run from within a process event handler (in which this refers to the process), 
		they bind the process as this instead of the client.
		That is why the below function is an arrow function, because arrow functions do not bind the calling object as this, so this always stays the client.
		It has to be like this because we call this function from within process.on('unhandledRejection') in which case this became the process,
		which gave us the error process.getChannel() is not a function, because getChannel obviously only exists on the client. 

	*/
	handleError = async (err: Error, message?: Message) => {
		console.error(err);

		const channel = this.getChannel('errors');

		const errorEmbed = new MessageEmbed()
			.setColor(this.settings.colours.ERROR)
			.setTitle(err.name)
			.setDescription((err.stack || 'No Error.').shorten(2000).toCodeblock());
		if (message) {
			errorEmbed.addFields([
				{ name: 'Message', value: (message.content || 'Empty message').shorten(1024) },
				{
					name: 'Message Info',
					value: stripIndents`
                Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : '-'}
                Author: ${message.author.tag} (${message.author.id})`
				}
			]);
			message.reply(
				new MessageEmbed()
					.setColor(this.settings.colours.ERROR)
					.setDescription('Sadly, an error internal occurred. There is no need to report this, as all errors will automatically notify my devs!')
			);
		}
		return channel.send((await this.getDevelopers()).join(' '), errorEmbed);
	};

	async getPrefix(identifier: Message | GuildMember | GuildMessage) {
		return (await this.cache.getGuild(identifier))?.settings.prefix || this.config.defaultPrefix;
	}
	async getPrefixes(identifier: Message | GuildMember | GuildMessage) {
		return (await this.cache.getGuild(identifier))?.settings.prefixes;
	}
	async getUserPrefixes(user: User) {
		return (await this.cache.getUser(user)).prefixes;
	}

	getCommand(commandName: string) {
		return this.commands.find(cmd => cmd.name === commandName.toLowerCase() || cmd.aliases.includes(commandName.toLowerCase()));
	}
	async getDevelopers() {
		return Promise.all(this.config.developers.map(d => this.users.fetch(d)));
	}
}
