import { Message } from '..';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';

export const wrongsyntax = async (message: Message, text: string, del = false) => {
    const msg = await message.reply(text);
    if (!msg.guild || !del) return;

    msg.delete({ timeout: 1000 * 10 }).catch(() => null);
    message.delete({ timeout: 1000 * 10 }).catch(() => null);
};

export const codeBlock = (str: string, lang?: string) => {
    return '```' + `${lang || ''}\n${str}` + '```';
};

export const trimString = (str: string, len = 2000) => {
    return str.length > len ? str.slice(0, len - 3) + '...' : str;
};

export const fetch = async (requestInfo: RequestInfo, requestOptions?: RequestInit) => {
    const result = await nodeFetch(requestInfo, requestOptions)
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        })
        .catch(console.error);
    return result;
};

export const uploadHaste = async (text: string) => {
    const result = await fetch('https://hasteb.in/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
        redirect: 'follow'
    });
    return result ? `https://hasteb.in/${result.key}` : 'Failed to upload to hastebin!';
};
