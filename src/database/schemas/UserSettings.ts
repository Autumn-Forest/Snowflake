import { Document, Schema, model } from 'mongoose';

export interface UserSettings extends Document {
	user: string;
	prefixes: string[];
}

const UserSchema = new Schema({
	user: String,
	prefixes: [String]
});

export const userSettings = model<UserSettings>('UserSettings', UserSchema);
