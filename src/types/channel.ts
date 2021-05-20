import { APIMessage } from "./message";
import { APIUser } from "./user";

export type APIChannel = {
  id: string,
  name: string,
  type: null,
  members: APIUser[] | null;
  messages: APIMessage[] | null;
}
