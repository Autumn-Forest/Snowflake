import mongoose from 'mongoose';

export type GuildChannelSettings =
	| 'welcomeChannel'
	| 'introChannel'
	| 'modLogChannel'
	| 'messageLogChannel'
	| 'memberLogChannel'
	| 'automodLogChannel'
	| 'serverLogChannel';

interface Settings {
	prefix: string;
	nsfw: boolean; // Whether NSFW commands are enabled or not
	blockedChannels: string[]; // An array of IDs of blocked channels (No commands here)
	blockedUsers: string[]; // An array of IDs of blocked users (Unable to use commands)
	disabledCommands: string[]; // An array of disabled commands
	deleteCommandTriggers: boolean; // Whether or not to delete command triggers after success
	deleteFailedCommands: boolean; // Whether or not to delete triggers and response of failed commands
}

export interface GuildSettings extends mongoose.Document {
	guild: string; // The guild ID
	settings: Settings;
	roles: {
		muted: string; // The ID of the mute role
	};
	channels: {
		[key in GuildChannelSettings]: string;
	};
	welcome: {
		message: string;
		autoRole: string;
	};
}

const GuildSchema: mongoose.Schema = new mongoose.Schema({
	guild: String,
	settings: {
		prefix: String,
		nsfw: Boolean,
		blockedChannels: [String],
		blockedUsers: [String],
		disabledCommands: [String],
		deleteCommandTriggers: Boolean,
		deleteFailedCommands: Boolean
	},
	roles: {
		muted: String
	},
	channels: {
		welcomeChannel: String,
		introChannel: String,
		modLogChannel: String,
		messageLogChannel: String,
		memberLogChannel: String,
		automodLogChannel: String,
		serverLogChannel: String
	},
	welcome: {
		message: String,
		autoRole: String
	}
});

export const guildSettings = mongoose.model<GuildSettings>('GuildSettings', GuildSchema);
