import { Client as DClient, Collection, Message, PermissionString } from 'discord.js';
import { config } from '../config';
import { database } from '../database';

// Our custom client adding new properties to the Discord Client
export class Client extends DClient {
	commands: Collection<string, Command> = new Collection(); // Our commands
	config = config; // Store the config on the client for ease of access
	database = database; // Store the database on the client for ease of access
}

export interface Command {
	name: string; // The name of the command
	category: string; // The category of this command, used to separate commands in the help command
	description: string; // The description of the command
	usage: string; // How to use this command
	aliases: string[]; // The aliases of this command, these can be used instead of the name
	requiresArgs: number; // How many args this command requires
	devOnly: boolean; // Whether this command should only be usable by developers
	guildOnly: boolean; // Whether this command should only be usable on a guild
	userPermissions: '' | PermissionString;
	botPermissions: '' | PermissionString;
	callback(message: Message, args: string[]): Promise<void | Message>; // The command function
}

// Client events, no need to touch these unless new events are added to discord.js
export type ClientEventTypes =
	| 'channelCreate'
	| 'channelDelete'
	| 'channelPinsUpdate'
	| 'channelUpdate'
	| 'debug'
	| 'warn'
	| 'disconnect'
	| 'emojiCreate'
	| 'emojiDelete'
	| 'emojiUpdate'
	| 'error'
	| 'guildBanAdd'
	| 'guildBanRemove'
	| 'guildCreate'
	| 'guildDelete'
	| 'guildUnavailable'
	| 'guildIntegrationsUpdate'
	| 'guildMemberAdd'
	| 'guildMemberAvailable'
	| 'guildMemberRemove'
	| 'guildMembersChunk'
	| 'guildMemberSpeaking'
	| 'guildMemberUpdate'
	| 'guildUpdate'
	| 'inviteCreate'
	| 'inviteDelete'
	| 'message'
	| 'messageDelete'
	| 'messageReactionRemoveAll'
	| 'messageReactionRemoveEmoji'
	| 'messageDeleteBulk'
	| 'messageReactionAdd'
	| 'messageReactionRemove'
	| 'messageUpdate'
	| 'presenceUpdate'
	| 'rateLimit'
	| 'ready'
	| 'invalidated'
	| 'roleCreate'
	| 'roleDelete'
	| 'roleUpdate'
	| 'typingStart'
	| 'userUpdate'
	| 'voiceStateUpdate'
	| 'webhookUpdate'
	| 'shardDisconnect'
	| 'shardError'
	| 'shardReady'
	| 'shardReconnecting'
	| 'shardResume';
