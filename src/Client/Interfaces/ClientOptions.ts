export interface ClientOptions {
	colours?: Record<ClientColours, string>;
	debug?: boolean;
	flushTime?: number;
	promptTimeout?: number;
	commandCooldown?: number;
}

export type ClientColours = 'ERROR' | 'INFO' | 'BASIC';
