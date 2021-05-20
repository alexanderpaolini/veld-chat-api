/// <reference types="node" />
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import User from './User';
import { APIChannel, APIUser, APIMessage } from '../types';
import { CacheHandler, CacheOptions } from './CacheHandler';
import { CommandHandler, CommandHandlerOptions } from './CommandHandler';
interface ClientOptions {
    heartbeatInterval: number;
    host: string;
    cache: CacheOptions;
    commandOptions: CommandHandlerOptions;
}
declare class Client extends EventEmitter {
    /**
     * Whether or not the client is connected
     */
    isConnected: boolean;
    /**
     * Client Options
     */
    options: ClientOptions;
    /**
     * Internal WS
     */
    websocket: WebSocket;
    /**
     * The cache handler
     */
    cache: CacheHandler;
    /**
     * The client user
     */
    user: User;
    /**
     * Ping updated on every fetch request
     */
    restPing: number;
    /**
     * Commands
     */
    commands: CommandHandler;
    /**
     * Bot token
     */
    private token;
    constructor(options?: ClientOptions);
    connect(token: string): void;
    private _request;
    fetchUsers(channelID: string): Promise<APIUser[]>;
    sendMessage(channelID: string, data: string | object): Promise<APIMessage>;
    joinChannel(channelName: string): Promise<APIChannel>;
}
export default Client;
