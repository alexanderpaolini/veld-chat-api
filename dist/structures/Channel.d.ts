import { APIChannel, APIUser, APIMessage } from '../types';
import Client from './Client';
/**
 * Channel Class
 */
declare class Channel {
    private readonly client;
    /**
     * The channel ID
     */
    id: string;
    /**
     * The channel name
     */
    name: string;
    /**
     * Channel type
     */
    /**
     * Members currently in the channel
     */
    members: APIUser[] | null;
    /**
     * Messages in the channel
     */
    messages: APIMessage[] | null;
    constructor(data: APIChannel, client: Client);
    /**
     * Send a message to a channel
     * @param data Data to send to the channel
     */
    send(data: string | object): Promise<APIMessage>;
    /**
     * Fetch the users in a channel
     */
    fetchUsers(): Promise<APIUser[]>;
    /**
     * Join the channel
     */
    join(): Promise<APIChannel>;
}
export default Channel;
