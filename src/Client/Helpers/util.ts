import { Message } from '..';

export const wrongsyntax = async (message: Message, text: string, del = false) => {
    const msg = await message.reply(text);
    if (!msg.guild || !del) return;

    msg.delete({ timeout: 1000 * 10 }).catch(() => null);
    message.delete({ timeout: 1000 * 10 }).catch(() => null);
};
