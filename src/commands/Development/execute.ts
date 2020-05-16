import { exec } from 'child_process';
import { Message, Command } from '../../Client';

let msg: Message;
const callback = async (msg: Message, args: string[]) => {
	exec(args.join(' '), async (err, stdout, stderr) => {
		if (err) msg.channel.send(await sendLongText(err.stack!), { code: 'xl' });
		if (stderr) msg.channel.send(await sendLongText(stderr), { code: 'xl' });
		return msg.channel.send((await sendLongText(stdout)) || 'No output!', { code: 'xl' });
	});
};

export const command: Command = {
	name: 'execute',
	category: 'Dev',
	aliases: ['exec', 'exe', 'exc'],
	usage: '',
	devOnly: true,
	nsfw: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

const sendLongText = async (text: string) => (text.length > 2000 ? await msg.client.helpers.util.uploadHaste(text) : text);
