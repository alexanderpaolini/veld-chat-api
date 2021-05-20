import { APIMessage } from './message'
import { APIUser } from './user'

export interface APIChannel {
  id: string
  name: string
  type: null
  members: APIUser[] | null
  messages: APIMessage[] | null
}
