import socket from "socket.io-client";
import fetch from 'node-fetch';
import loggers, { Logger } from 'loggers';
import { EventEmitter } from 'events';

// Classes
import { Message } from './Message';
import { Channel } from './Channel';

// Types
import RawChannel from '../types/RawChannel'
import RawMessage from '../types/RawMessage'
import RawUser from '../types/RawUser'
import ReadyPayload from '../types/ReadyPayload'

interface ClientOptions {
  debug: true,
  name?: string
}

export class Client extends EventEmitter {
  socket: socket;
  logger: Logger;
  token: string;
  private debug: boolean;
  channels: Map<string, Channel>;
  users: Map<string, RawUser>;
  constructor(token: string, options: ClientOptions) {
    super()
    // Logging and Connecting
    this.socket = socket("https://chat-gateway.veld.dev")
    this.logger = new loggers.Logger({ debug: options.debug, catch: false, colors: true, newLine: false, method: console.log })

    // Options
    this.token = token;
    this.debug = options.debug;

    // Caching?
    this.channels = new Map();
    this.users = new Map();

    this.socket.on("connect", () => {
      this.logger.debug("Connected to socket.");
      this.socket.emit("login", { token: token, bot: true });
    })
    this.socket.on('ready', (data: ReadyPayload) => {
      this.socket.emit("message:create", { content: "/nick " + options.name, channelId: data.mainChannel });
      data.channels.forEach(channel => {
        this.channels.set(channel.id, new Channel(channel.id, this));
      })
      data.members.forEach(member => {
        this.users.set(member.id, member);
      })
    })
    this.socket.on('user:join', (user: RawUser) => {
      this.users.set(user.id, user);
    });
    this.socket.on('user:leave', (user: RawUser) => {
      this.users.delete(user.id);
    });
    this.socket.on('channel:create', (channel: RawChannel) => {
      this.channels.set(channel.id, new Channel(channel.id, this));
    });
    this.socket.on('channel:delete', (channel: RawChannel) => {
      this.channels.delete(channel.id);
    });
    this.socket.on('message:create', (message: RawMessage) => {
      this.emit('message', new Message(message, this))
    })
  }

  sendMessage(channelID: string, data: string | object) {
    if (typeof data == 'string') data = { content: data };
    fetch(`https://chat-gateway.veld.dev/api/v1/channels/${channelID}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.token}` },
      body: JSON.stringify(data)
    })
  }
}