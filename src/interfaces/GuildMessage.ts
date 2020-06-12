import { Message } from '../Client';
import { Guild, GuildMember, NewsChannel, TextChannel } from 'discord.js';

export interface GuildMessage extends Message {
	guild: Guild;
	member: GuildMember;
	channel: TextChannel | NewsChannel;
}
