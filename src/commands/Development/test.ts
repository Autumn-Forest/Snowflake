import { Command, Message, handleError } from '../../Client';

class Callback {
	@handleError()
	static async run(msg: Message, _args: string[]) {
		msg.delete();
		msg.delete();
	}
}

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	args: 0,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: Callback.run
};
