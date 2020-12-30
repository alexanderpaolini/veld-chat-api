import RawMessage from '../types/RawMessage';
import { Channel } from './Channel';
import { Client } from './Client';

export class Message {
  id: string;
  channel: Channel;
  user: string;
  content: string;
  client: Client;
  mentions: string[];
  constructor(data: RawMessage, client: Client) {
    this.id = data.id;
    this.channel = new Channel(data.channelId, client);
    this.user = data.user;
    this.content = data.content;
    this.client = client;
    this.mentions = data.mentions;
  }
}