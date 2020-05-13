import {
    Client as BaseClient,
    ClientOptions as BaseClientOptions,
    Message as BaseMessage,
    Collection,
    PermissionString,
    GuildMember,
    DMChannel,
    TextChannel,
    MessageEmbed
} from 'discord.js';
import { config } from '../config';
import { constants } from '../constants';
import { database } from '../database';
import { join } from 'path';
import { readdirSync } from 'fs';
import { ClientHelpers } from './Helpers';
import { stripIndents } from 'common-tags';

const BaseClientOptions: BaseClientOptions = {
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: `${config.defaultPrefix}help`,
            type: 'LISTENING',
            url: 'https://www.twitch.tv/.'
        }
    },
    partials: ['MESSAGE', 'REACTION']
};

export class Client extends BaseClient {
    constructor(options?: ClientOptions) {
        super(BaseClientOptions);
        if (options) {
            this.debug = options.debug === true;
            if (options.colours)
                Object.keys(options.colours).forEach(
                    key => (this.colours[key as ClientColours] = options.colours![key as ClientColours] || this.colours[key as ClientColours])
                );
        }
        this.initCommands();
        this.initListeners();
    }

    debug = false;
    config = config;
    constants = constants;
    helpers = ClientHelpers;
    database = database;
    commands: Collection<string, Command> = new Collection();
    colours: { [key in ClientColours]: string } = {
        ERROR: 'FF403C',
        INFO: '0D7DFF',
        BASIC: 'A630FF'
    };
    paths = {
        listeners: join(__dirname, '../events'),
        commands: join(__dirname, '../commands')
    };

    initCommands() {
        let amount = 0;
        readdirSync(this.paths.commands).forEach(dir => {
            readdirSync(join(this.paths.commands, dir)).forEach(file => {
                const path = join(this.paths.commands, dir, file);
                const command: Command = require(path).command;
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
        console.log(`Loaded ${amount} listeners!`);
    }

    getChannel(chan: 'info' | 'errors') {
        const channel = this.channels.cache.get(this.config.channels[chan]);
        if (!channel || !(channel instanceof TextChannel)) throw new Error(`Invalid ${chan}-channel provided or not reachable.`);
        return channel;
    }

    handleError(err: Error, message?: Message) {
        console.error(err);

        const channel = this.getChannel('errors');

        const errorEmbed = new MessageEmbed()
            .setColor(this.colours.ERROR)
            .setTitle(err.name)
            .setDescription(this.helpers.util.codeBlock(this.helpers.util.trimString(err.stack || 'No Error.', 2048), 'js'));
        if (message)
            errorEmbed.addFields([
                { name: 'Message', value: this.helpers.util.codeBlock(this.helpers.util.trimString(message!.content, 1024)) },
                {
                    name: 'Message Info',
                    value: stripIndents`
                Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : '-'}\n
                Author: ${message.author.tag} (${message.author.username})`
                }
            ]);

        return channel.send(errorEmbed);
    }

    missingPermissions(message: Message, permissions: PermissionString[], member?: GuildMember) {
        if (message.channel instanceof DMChannel) return;
        const allPermissions = message.channel.permissionsFor(member || message.guild!.me!);
        const missing = permissions.filter(p => allPermissions?.has(p));
        return missing.length ? missing : undefined;
    }

    async getSettings(identifier: Message | GuildMember) {
        return identifier.guild
            ? (await this.database.guildSettings.findOne({ guild: identifier.guild.id })) ||
                  (await this.database.guildSettings.create({ guild: identifier.guild.id }))
            : null;
    }

    async getPrefix(identifier: Message | GuildMember) {
        return (await this.getSettings(identifier))?.settings.prefix || this.config.defaultPrefix;
    }

    getCommand(commandName: string) {
        return this.commands.find(cmd => cmd.name === commandName.toLowerCase() || cmd.aliases.includes(commandName.toLowerCase()));
    }
}

export interface ClientOptions {
    colours?: { [key in ClientColours]?: string };
    debug?: boolean;
}

export type ClientColours = 'ERROR' | 'INFO' | 'BASIC';

export interface Message extends BaseMessage {
    client: Client;
}

export interface Command {
    name: string;
    category: string;
    aliases: string[];
    devOnly: boolean;
    guildOnly: boolean;
    nsfw: boolean;
    args: number;
    memberPermission: PermissionString[];
    botPermission: PermissionString[];
    callback(message: Message, args: string[]): Promise<BaseMessage | void>;
}
