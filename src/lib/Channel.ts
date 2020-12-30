import { Client } from "./Client";

export class Channel {
  id: string;
  client: Client;
  constructor(id: string, client: Client) {
    this.id = id;
    this.client = client;
  }

  async send (data: string | object) {
    return this.client.sendMessage(this.id, data)
  }
}