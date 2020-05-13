import { Client } from './Client';

const client = new Client({
    debug: false
});

client.login(client.config.token);
