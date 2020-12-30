import RawChannel from "../types/RawChannel";
import RawUser from "../types/RawUser";
import { Client } from "./Client";

export class Channel {
  id: string;
  system: boolean;
  name: string;
  members: RawUser[];
  client: Client;
  constructor(data: RawChannel, client: Client) {
    this.id = data.id;
    this.system = data.system;
    this.name = data.name;
    this.members = data.members
    this.client = client;
  }

  async send (data: string | object) {
    return this.client.sendMessage(this.id, data)
  }
}