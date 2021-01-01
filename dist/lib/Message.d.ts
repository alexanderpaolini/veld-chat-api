import RawMessage from "../types/RawMessage";
import Channel from "./Channel";
import Client from "./Client";
import User from "./User";
declare class Message {
    id: string;
    content: string;
    embed: string;
    author: User;
    timestamp: Date;
    channel: Channel;
    constructor(data: RawMessage, client: Client);
}
export default Message;
