import { Document, Schema, model } from 'mongoose';

export interface ClientSettings extends Document {
	client: string;
	annoucementsWebhooks: string[];
}

const ClientSchema = new Schema({
	client: String,
	annoucementsWebhooks: [String]
});

export const clientSettings = model<ClientSettings>('ClientSettings', ClientSchema);
