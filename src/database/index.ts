import mongoose from 'mongoose';
import { config } from '../config';
import { guildSettings } from './schemas/GuildSettings';

mongoose.connect(config.mongoString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error);

db.once('open', () => console.log(`Connected to MongoDB Atlas at ${db.name}!`));

export const database = {
    guildSettings: guildSettings
};
