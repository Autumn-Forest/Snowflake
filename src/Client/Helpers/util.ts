import { Message } from '..';

export const wrongsyntax = async (message: Message, text: string, del = false) => {
    const msg = await message.reply(text);
    if (!msg.guild || !del) return;

    msg.delete({ timeout: 1000 * 10 }).catch(() => null);
    message.delete({ timeout: 1000 * 10 }).catch(() => null);
};

export const codeBlock = (str: string, lang?: string) => {
    return '```' + `${lang}'\n'${str}` + '```';
};

export const trimString = (str: string, len = 2000) => {
    return str.length > len ? str.slice(0, len - 3) + '...' : str;
};
