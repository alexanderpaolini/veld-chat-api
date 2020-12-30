import RawMessage from '../types/RawMessage';
import RawUser from '../types/RawUser';
import { Channel } from './Channel';
import { Client } from './Client';
export declare class Message {
    id: string;
    channel: Channel;
    user: RawUser;
    content: string;
    client: Client;
    mentions: string[];
    constructor(data: RawMessage, client: Client);
}
