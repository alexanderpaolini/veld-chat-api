import { APIUser } from "./user";

export type APIMessage = {
  id: string;
  embed: null;
  content: string;
  author: APIUser;
  timestamp: string;
  channelId: string;
}
