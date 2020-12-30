import RawMessage from '../types/RawMessage';
import RawUser from '../types/RawUser';
import { Channel } from './Channel';
import { Client } from './Client';

export class Message {
  id: string;
  channel: Channel;
  user: RawUser;
  content: string;
  client: Client;
  mentions: string[];
  constructor(data: RawMessage, client: Client) {
    this.id = data.id;
    this.channel = new Channel(data.channelId, client);
    this.user = client.users.get(data.user);
    this.content = data.content;
    this.client = client;
    this.mentions = data.mentions;
  }
}