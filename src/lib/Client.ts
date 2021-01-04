import { EventEmitter } from 'events';
import WebSocket from 'ws';
import fetch from 'node-fetch';

import Channel from './Channel';
import Message from './Message';

import User from './User';
import RawChannel from '../types/RawChannel';
import RawUser from '../types/RawUser';
import CacheObject from './CacheObject';

enum MessageType {
  Authorize = 0,
  Ready = 1,
  MessageCreate = 2,
  MessageUpdate = 3,
  MessageDelete = 4,
  UserUpdate = 8,
  MemberCreate = 9,
  MemberDelete = 11,
  PresenceUpdate = 12,
  Heartbeat = 1000,
  HeartbeatAck = 1001,
}

interface WebSocketPayload {
  t: MessageType;
  d: any;
}

interface ClientCache {
  channels: CacheObject;
  users: CacheObject;
}

interface ClientOptions {
  heartbeatInterval: number;
  host: string;
}

class Client extends EventEmitter {
  connection: number;
  isConnected: boolean;
  options: ClientOptions;
  websocket: WebSocket;
  cache: ClientCache;
  user: User;
  restPing: number;
  private token: string;

  constructor(options?: ClientOptions) {
    super();
    this.options = Object.assign(options || {}, { host: 'api.veld.chat', heartbeatInterval: 15000 });
    this.isConnected = false;
    this.cache = {
      channels: new CacheObject(),
      users: new CacheObject()
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

    this.websocket.on('close', () => {
      this.isConnected = false;
      throw new Error('Token is incorrect.');
    });

    this.websocket.on('message', (data) => {
      const payload = JSON.parse(data.toString()) as WebSocketPayload;
      this.emit('raw', payload);
      switch (payload.t) {
        // Authorize is 0
        case MessageType.Authorize:
          break;

        // Ready is 1
        case MessageType.Ready:
          this.user = new User(payload.d.user);
          payload.d.channels.forEach((channel: RawChannel) => {
            this.cache.channels.set(channel.id, new Channel(channel, this));
          });
          this.emit('ready', this.user);
          this.fetchUsers('1').then((users: RawUser[]) => {
            users.forEach((user: RawUser) => {
              this.cache.users.set(user.id, new User(user));
            })
          })
          // while (!this.user.bot) {};
          break;

        // MessageCreate is 2
        case MessageType.MessageCreate:
          this.cache.users.set(payload.d.author.i, new User(payload.d.author));
          this.emit('message', new Message(payload.d, this));
          break;

        // Message Update is 3
        case MessageType.MessageUpdate:
          break;

        // Message Delete is 4
        case MessageType.MessageDelete:
          break;

        // User Update is 8
        case MessageType.UserUpdate:
          const oldUser = this.cache.users.get(payload.d.id);
          const newUser = new User(payload.d);
          this.cache.users.set(newUser.id, newUser);
          this.emit('userUpdate', oldUser, newUser)
          break;

        // Member Create is 9
        case MessageType.MemberCreate:
          break;

        // Member Delete is 11
        case MessageType.MemberDelete:
          break;

        // Presense Update is 12
        case MessageType.PresenceUpdate:
          break;

        // Heartbeat is 1000
        case MessageType.Heartbeat:
          this.emit('debug', '[Websocket] Sent Heartbeat')
          break;

        // HeartbeatAck is 1001
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
