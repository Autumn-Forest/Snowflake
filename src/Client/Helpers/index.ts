import { Getters } from './getters';
import { Client } from '..';

export class BaseClass {
	constructor(client: Client) {
		this.client = client;
	}
	client: Client;
}

export class ClientHelpers extends Getters {}
