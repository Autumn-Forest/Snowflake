import { ClientOptions as BaseClientOptions } from 'discord.js';

export interface ClientOptions {
	baseOptions?: BaseClientOptions;
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	colours?: Record<ClientColours, string>;
	debug?: boolean;
	flushTime?: number;
	promptTimeout?: number;
	commandCooldown?: number;
}

export type ClientColours = 'ERROR' | 'INFO' | 'BASIC';
