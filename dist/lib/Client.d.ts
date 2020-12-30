/// <reference types="node" />
import { Socket } from "socket.io-client";
import { Logger } from 'loggers';
import { EventEmitter } from 'events';
import { Channel } from './Channel';
import RawUser from '../types/RawUser';
interface ClientOptions {
    debug: true;
    name?: string;
}
export declare class Client extends EventEmitter {
    socket: typeof Socket;
    logger: Logger;
    token: string;
    private debug;
    channels: Map<string, Channel>;
    users: Map<string, RawUser>;
    constructor(token: string, options: ClientOptions);
    sendMessage(channelID: string, data: string | object): boolean;
}
export {};
