import { APIMessage, APIEmbed } from '../types'

import Channel from './Channel'
import Client from './Client'
import User from './User'

/**
 * Message Class
 */
class Message {
  /**
   * Message ID
   */
  id: string
  /**
   * Message Content
   */
  content?: string
  /**
   * The embed in the message
   */
  embed: APIEmbed | null
  /**
   * Author of the message
   */
  author: User
  /**
   * When the message was created, I think?
   */
  timestamp: Date
  /**
   * The channel of the message
   */
  channel: Channel | undefined

  constructor (data: APIMessage, private readonly client: Client) {
    this.id = data.id
    this.content = data.content
    this.embed = data.embed
    this.author = new User(data.author)
    this.timestamp = new Date(data.timestamp)
    this.channel = client.cache.channels.get(data.channelId)
  }
}

export default Message
