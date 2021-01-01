import { EventEmitter } from 'events';
import WebSocket from 'ws';
import fetch, { Body } from 'node-fetch';

import Channel from './Channel';
import Message from './Message';

import User from './User';
import RawChannel from '../types/RawChannel';

enum MessageType {
  Authorize = 0,
  Ready = 1,
  MessageCreate = 2,
  MessageUpdate = 3,
  MessageDelete = 4,
  UserUpdate = 8,
  Heartbeat = 1000,
  HeartbeatAck = 1001,
}

interface WebSocketPayload {
  t: MessageType;
  d: any;
}

interface ClientCache {
  channels: object;
  users: object;
}

interface ClientOptions {
  heartbeatInterval: number;
  host: string;
}

class Client extends EventEmitter {
  isConnected: boolean;
  options: ClientOptions;
  websocket: WebSocket;
  cache: ClientCache;
  token: string;
  user: User;
  restPing: number;

  constructor(options?: ClientOptions) {
    super();
    // Get the default options correct
    this.options = Object.assign(options || {}, { host: 'api.veld.chat', heartbeatInterval: 15000 });
    // Make sure it connects
    this.isConnected = false;
    // Define the cache (use FakeMap later for easier use)
    this.cache = {
      channels: {},
      users: {}
    };
  }

  connect(token: string) {
    this.token = token;
    if (this.isConnected) return;

    this.websocket = new WebSocket(`wss://${this.options.host}`);

    this.websocket.on('open', () => {
      this.isConnected = true;
      this.websocket.send(JSON.stringify({
        t: MessageType.Authorize,
        d: {
          token: this.token,
          bot: true,
        }
      }));
      setInterval(() => {
        if (!this.isConnected) return;
        this.websocket.send(JSON.stringify({
          t: MessageType.Heartbeat,
          d: null,
        }))
      }, this.options.heartbeatInterval)
    });

    this.websocket.on('error', (err) => {
      console.log("error", err);
    });

    this.websocket.on('close', (code, reason) => {
      this.isConnected = false;
      this.connect(this.token);
    });

    this.websocket.on('message', (data) => {
      const payload = JSON.parse(data.toString()) as WebSocketPayload;
      this.emit('raw', payload);
      switch (payload.t) {
        case MessageType.Authorize:
          break;
        case MessageType.Ready:
          this.user = new User(payload.d.user);
          payload.d.channels.forEach((channel: RawChannel) => {
            this.cache.channels[channel.id] = new Channel(channel, this);
          });
          this.cache.users[this.user.id] = this.user;
          this.emit('ready', this.user);
          // while (!this.user.bot) {};
          break;
        case MessageType.MessageCreate:
          this.emit('message', new Message(payload.d, this));
          break;
        case MessageType.MessageUpdate:
          break;
        case MessageType.MessageDelete:
          break;
        case MessageType.UserUpdate:
          const oldUser = this.cache.users[payload.d.id];
          const newUser = new User(payload.d);
          this.cache.users[newUser.id] = newUser;
          this.emit('userUpdate', oldUser, newUser)
          break;
        case MessageType.Heartbeat:
          this.emit('debug', '[Websocket] Sent Heartbeat')
          break;
        case MessageType.HeartbeatAck:
          this.emit('debug', '[Websocket] HeartbeatAck?')
          break;
      }
      return false;
    })
  }

  private async _request(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body: any) {
    return await fetch('https://' + this.options.host + '/' + url, {
      method: method,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.token}` },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async fetchUsers(channelID: string) {
    return await this._request('GET', `channels/${channelID}/members`, null).then(async req => await req.json())
  }

  async sendMessage(channelID: string, data: string | object): Promise<any> {
    if (typeof data == 'string') data = { content: data };
    return await this._request('POST', `channels/${channelID}/messages`, data).then(async req => await req.json());
  }

  // channelID soon™️ - Veld
  async joinChannel(channelName: string): Promise<any> {
    const body = { channel: channelName };
    return await this._request('POST', 'channels/join', body);
  }

}

export default Client;
