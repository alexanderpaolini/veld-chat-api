import { APIEmbed, APIUser } from '.'

export interface APIMessage {
  id: string
  embed: null | APIEmbed
  content: string
  author: APIUser
  timestamp: string
  channelId: string
}
