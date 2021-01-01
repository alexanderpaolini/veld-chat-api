import RawMessage from "../types/RawMessage";
import Channel from "./Channel";
import Client from "./Client";
import User from "./User";

class Message {
  id: string;
  content: string;
  embed: string;
  author: User;
  timestamp: Date;
  channel: Channel;
  constructor(data: RawMessage, client: Client) {
    this.id = data.id;
    this.content = data.content;
    this.embed = data.embed;
    this.author = new User(data.author);
    this.timestamp = new Date(data.timestamp);
    this.channel = client.cache.channels[data.channelId];
  }
}

export default Message;
