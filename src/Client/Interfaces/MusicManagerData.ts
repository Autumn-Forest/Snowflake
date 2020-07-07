import { StreamDispatcher, VoiceConnection } from 'discord.js';

export interface Music {
	playlist?: [PlaylistDetail];
	currentStreamDispatcher?: StreamDispatcher;
	currrentVoiceConnection?: VoiceConnection;
}

interface PlaylistDetail {
	user: string;
	link: string;
	more: object;
}
