import { Client } from '../Client';

export const listener = (client: Client) => {
    if (!client.user) return;

    const channel = client.getChannel('info');

    const info = [
        { key: 'Prefix', val: client.config.defaultPrefix },
        { key: 'Guilds', val: client.guilds.cache.size },
        { key: 'Channels', val: client.channels.cache.size },
        { key: 'Users', val: client.guilds.cache.reduce((x, y) => x + y.memberCount, 0) },
        { key: 'Database name', val: client.database.guildSettings.db.name },
        { key: 'Database', val: Object.keys(client.database.guildSettings.db.collections).join(', ') }
    ];

    console.info(`Connected to Discord as ${client.user.tag} - ${client.user.id}\n` + info.map(obj => `${obj.key}: ${obj.val}`).join('\n'));
    channel.send(
        client
            .newEmbed('INFO')
            .setTitle("I'M ALIIIIIVEEEEEE d-(^_^)-b")
            .setDescription(info.map(obj => `**${obj.key}:** \`${obj.val}\``).join('\n'))
    );
};
