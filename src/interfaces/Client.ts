import Discord, { Collection, PermissionString } from 'discord.js';
import { config } from '../config';

const ClientOptions = {};

export class Client extends Discord.Client {
    constructor() {
        super(ClientOptions);
    }
    config = config;
    commands: Collection<string, Command> = new Collection();
}

export interface Message extends Discord.Message {
    client: Client;
}

export interface Command {
    name: string;
    category: string;
    aliases: string;
    devOnly: boolean;
    guildOnly: boolean;
    nsfw: boolean;
    args: number;
    memberPermission: PermissionString[];
    botPermission: PermissionString[];
    callback(message: Message, args: string[]): Promise<Message | void>;
}
