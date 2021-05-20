import { APIMessage, APIEmbed } from '../types';
import Channel from './Channel';
import Client from './Client';
import User from './User';
/**
 * Message Class
 */
declare class Message {
    private readonly client;
    /**
     * Message ID
     */
    id: string;
    /**
     * Message Content
     */
    content?: string;
    /**
     * The embed in the message
     */
    embed: APIEmbed | null;
    /**
     * Author of the message
     */
    author: User;
    /**
     * When the message was created, I think?
     */
    timestamp: Date;
    /**
     * The channel of the message
     */
    channel: Channel | undefined;
    constructor(data: APIMessage, client: Client);
}
export default Message;
