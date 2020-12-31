/// <reference types="socket.io-client" />
/// <reference types="node" />
import { Logger } from 'loggers';
import { EventEmitter } from 'events';
import { Channel } from './Channel';
import RawUser from '../types/RawUser';
interface ClientOptions {
    debug: true;
    name?: string;
}
export declare class Client extends EventEmitter {
    socket: SocketIOClient.Socket;
    logger: Logger;
    token: string;
    private debug;
    channels: Map<string, Channel>;
    users: Map<string, RawUser>;
    restPint: number;
    constructor(token: string, options: ClientOptions);
    sendMessage(channelID: string, data: string | object): Promise<boolean>;
}
export {};
