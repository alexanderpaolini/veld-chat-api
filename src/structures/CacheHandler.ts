import Collection from '@discordjs/collection'

import { Cache } from '@jpbberry/cache'

import Channel from './Channel'
import Message from './Message'
import User from './User'

/**
 * Cache options
 */
export interface CacheOptions {
  /**
   * Whether or not to cache channels
   */
  channels: boolean
  /**
   * Whether or not to cache users
   */
  users: boolean
}

/**
 * The cache handler.
 * Handles cache ofc
 */
export class CacheHandler {
  channels = new Collection<string, Channel>()
  users = new Collection<string, User>()
  messages = new Cache<string, Message>(30e3)

  /**
   * Clear all cache.
   * This probably shouldn't be used
   */
  clear (): void {
    this.channels.clear()
    this.users.clear()
    this.messages.clear()
  }
}
