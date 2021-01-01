import RawChannel from "../types/RawChannel";
import RawMessage from "../types/RawMessage";
import RawUser from "../types/RawUser";
import Client from "./Client";

class Channel {
  id: string;
  name: string;
  type: number;
  members: RawUser[] | null;
  messages: RawMessage[] | null;
  private _client: Client;
  constructor(data: RawChannel, client: Client) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.members = data.members;
    this.messages = data.messages;
    this._client = client;
  }

  async send (data: string | object) {
    return await this._client.sendMessage(this.id, data);
  }

  async fetchUsers () {
    return await this._client.fetchUsers(this.id);
  }
}

export default Channel;
