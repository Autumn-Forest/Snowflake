import { ClientOptions as BaseClientOptions } from 'discord.js';

export interface ClientOptions {
	baseOptions?: BaseClientOptions;
	colours?: Record<ClientColours, string>;
	debug?: boolean;
	flushTime?: number;
	promptTimeout?: number;
	commandCooldown?: number;
}

export type ClientColours = 'ERROR' | 'INFO' | 'BASIC';
