import { Client } from '../Client';

export const listener = (client: Client) => {
    const channel = client.getChannel('info');
    console.log('Ready!');
    channel.send('Ready!');
};
