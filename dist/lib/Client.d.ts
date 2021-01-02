/// <reference types="node" />
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import User from './User';
interface ClientCache {
    channels: object;
    users: object;
}
interface ClientOptions {
    heartbeatInterval: number;
    host: string;
}
declare class Client extends EventEmitter {
    connection: number;
    isConnected: boolean;
    options: ClientOptions;
    websocket: WebSocket;
    cache: ClientCache;
    token: string;
    user: User;
    restPing: number;
    constructor(options?: ClientOptions);
    connect(token: string): void;
    private _request;
    fetchUsers(channelID: string): Promise<any>;
    sendMessage(channelID: string, data: string | object): Promise<any>;
    joinChannel(channelName: string): Promise<any>;
}
export default Client;
