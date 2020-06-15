import { Message } from '..';
import { ClientEvents as BaseClientEvents, Message as BaseMessage } from 'discord.js';
import { FullCommand } from './Command';

export interface ClientEvents extends BaseClientEvents {
	commandUsed: [Message, FullCommand, BaseMessage | void];
	commandFailed: [Message, FullCommand, any];
}
