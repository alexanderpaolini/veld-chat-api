import { APIChannel, APIUser, APIMessage } from "../types";

import Client from "./Client";

/**
 * Channel Class
 */
class Channel {
  /**
   * The channel ID
   */
  id: string;
  /**
   * The channel name
   */
  name: string;
  /**
   * Channel type
   */
  type: number;
  /**
   * Members currently in the channel
   */
  members: APIUser[] | null;
  /**
   * Messages in the channel
   */
  messages: APIMessage[] | null;

  constructor(data: APIChannel, private readonly client: Client) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.members = data.members;
    this.messages = data.messages;
  }

  /**
   * Send a message to a channel
   * @param data Data to send to the channel
   */
  async send (data: string | object) {
    return await this.client.sendMessage(this.id, data);
  }

  /**
   * Fetch the users in a channel
   */
  async fetchUsers (): Promise<APIUser[]> {
    return await this.client.fetchUsers(this.id);
  }

  /**
   * Join the channel
   */
  async join() {
    return await this.client.joinChannel(this.name);
  }
}

export default Channel;
