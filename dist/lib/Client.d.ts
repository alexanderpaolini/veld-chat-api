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
    isConnected: boolean;
    options: ClientOptions;
    websocket: WebSocket;
    cache: ClientCache;
    token: string;
    user: User;
    restPing: number;
    constructor(options?: ClientOptions);
    connect(token: string): void;
    _request(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body: any): Promise<import("node-fetch").Response>;
    fetchUsers(channelID: string): Promise<any>;
    sendMessage(channelID: string, data: string | object): Promise<import("node-fetch").Response>;
}
export default Client;
