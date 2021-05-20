import { EventEmitter } from 'events'

import WebSocket from 'ws'
import fetch from 'node-fetch'

import Channel from './Channel'
import Message from './Message'
import User from './User'

import { APIChannel, APIUser, StatusType, MessageType, WebSocketPayload, APIMessage } from '../types'

import { CacheHandler, CacheOptions } from './CacheHandler'
import { CommandHandler, CommandHandlerOptions } from './CommandHandler'

interface ClientOptions {
  heartbeatInterval: number
  host: string
  cache: CacheOptions
  commandOptions: CommandHandlerOptions
}

class Client extends EventEmitter {
  /**
   * Whether or not the client is connected
   */
  isConnected = false
  /**
   * Client Options
   */
  options: ClientOptions
  /**
   * Internal WS
   */
  websocket: WebSocket
  /**
   * The cache handler
   */
  cache = new CacheHandler()
  /**
   * The client user
   */
  user!: User
  /**
   * Ping updated on every fetch request
   */
  restPing = 0
  /**
   * Commands
   */
  commands: CommandHandler

  /**
   * Bot token
   */
  private token!: string

  constructor (options?: ClientOptions) {
    super()
    this.options = Object.assign(options ?? {}, {
      host: 'api.veld.chat',
      heartbeatInterval: 15000,
      cache: {
        channels: true,
        users: true
      },
      commandOptions: {
        prefix: '!'
      }
    })
    this.isConnected = false

    this.websocket = new WebSocket(`wss://${this.options.host}`)
    this.commands = new CommandHandler(this, this.options.commandOptions)
  }

  connect (token: string): void {
    this.token = token
    if (this.isConnected) return

    this.websocket.on('open', () => {
      this.isConnected = true
      this.websocket.send(JSON.stringify({
        t: MessageType.Authorize,
        d: {
          token: this.token,
          bot: true
        }
      }))
      setInterval(() => {
        if (!this.isConnected) return
        this.websocket.send(JSON.stringify({
          t: MessageType.Heartbeat,
          d: null
        }))
      }, this.options.heartbeatInterval)
    })

    this.websocket.on('error', (err) => {
      console.log('error', err)
    })

    this.websocket.on('close', () => {
      this.isConnected = false
      throw new Error('Websocket closed')
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.websocket.on('message', async (data) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const payload = JSON.parse(data.toString()) as WebSocketPayload
      this.emit('raw', payload)
      switch (payload.t) {
        // Authorize is 0
        case MessageType.Authorize:
          break

        // Ready is 1
        case MessageType.Ready: {
          this.user = new User(payload.d.user)
          payload.d.channels.forEach((channel: APIChannel) => {
            this.cache.channels.set(channel.id, new Channel(channel, this))
          })
          this.emit('ready', this.user)
          await this.fetchUsers('1').then((users: APIUser[]) => {
            users.forEach((user: APIUser) => {
              this.cache.users.set(user.id, new User(user))
            })
          })
          break
        }

        // MessageCreate is 2
        case MessageType.MessageCreate:
          if (this.options.cache.users) this.cache.users.set(payload.d.author.id, new User(payload.d.author))
          this.emit('message', new Message(payload.d, this))
          break

        // Message Update is 3
        case MessageType.MessageUpdate: {
          break
        }

        // Message Delete is 4
        case MessageType.MessageDelete: {
          break
        }

        // User Update is 8
        case MessageType.UserUpdate: {
          const oldUser = this.cache.users.get(payload.d.id) ?? {}
          const newUser = new User(payload.d)
          if (this.options.cache.users) this.cache.users.set(newUser.id, newUser)
          this.emit('userUpdate', oldUser, newUser)
          break
        }

        // Member Create is 9
        case MessageType.MemberCreate:
          break

        // Member Delete is 11
        case MessageType.MemberDelete:
          break

        // Presense Update is 12
        case MessageType.PresenceUpdate:
          switch (payload.d.statusType) {
            // Online is 0
            case StatusType.Online: {
              const onlineUser = new User(payload.d.user)
              if (this.options.cache.users) this.cache.users.set(onlineUser.id, onlineUser)
              this.emit('statusUpdate', { text: payload.d.statusText, type: payload.d.statusType }, onlineUser, null)
              break
            }

            // Offline is 1
            case StatusType.Offline: {
              const offlineUser = this.cache.users.get(payload.d.user.id) ?? {}
              this.cache.users.delete(payload.d.user.id)
              this.emit('statusUpdate', { text: payload.d.statusText, type: payload.d.statusType }, null, offlineUser)
              break
            }
          }
          break

        // Heartbeat is 1000
        case MessageType.Heartbeat:
          this.emit('debug', '[Websocket] Sent Heartbeat')
          break

        // HeartbeatAck is 1001
        case MessageType.HeartbeatAck:
          this.emit('debug', '[Websocket] HeartbeatAck?')
          break
      }
      return false
    })
  }

  private async _request (method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body: any): Promise<any> {
    return await fetch('https://' + this.options.host + '/' + url, {
      method: method,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.token}` },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async fetchUsers (channelID: string): Promise<APIUser[]> {
    return await this._request('GET', `channels/${channelID}/members`, null).then(async req => req.json())
  }

  async sendMessage (channelID: string, data: string | object): Promise<APIMessage> {
    if (typeof data === 'string') data = { content: data }
    return await this._request('POST', `channels/${channelID}/messages`, data).then(async req => req.json())
  }

  // channelID soon™️ - Veld
  async joinChannel (channelName: string): Promise<APIChannel> {
    const body = { channel: channelName }
    return await this._request('POST', 'channels/join', body)
  }
}

export default Client
