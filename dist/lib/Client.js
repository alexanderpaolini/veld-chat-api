"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const loggers_1 = __importDefault(require("loggers"));
const events_1 = require("events");
// Classes
const Message_1 = require("./Message");
const Channel_1 = require("./Channel");
class Client extends events_1.EventEmitter {
    constructor(token, options) {
        super();
        // Logging and Connecting
        this.socket = socket_io_client_1.default("ws://chat-gateway.veld.dev");
        this.logger = new loggers_1.default.Logger({ debug: options.debug, catch: false, colors: true, newLine: false, method: console.log });
        // Options
        this.token = token;
        this.debug = options.debug;
        // Caching?
        this.channels = new Map();
        this.users = new Map();
        this.socket.on("connect", () => {
            this.logger.debug("Connected to socket.");
            this.socket.emit("login", { token: token, bot: true });
        });
        this.socket.on('ready', (data) => {
            this.socket.emit("message:create", { content: "/nick " + options.name, channelId: data.mainChannel });
            data.channels.forEach(channel => {
                this.channels.set(channel.id, new Channel_1.Channel(channel, this));
            });
            data.members.forEach(member => {
                this.users.set(member.id, member);
            });
        });
        this.socket.on('user:join', (user) => {
            this.users.set(user.id, user);
        });
        this.socket.on('user:leave', (user) => {
            this.users.delete(user.id);
        });
        this.socket.on('channel:create', (channel) => {
            this.channels.set(channel.id, new Channel_1.Channel(channel, this));
        });
        this.socket.on('channel:delete', (channel) => {
            this.channels.delete(channel.id);
        });
        this.socket.on('message:create', (message) => {
            this.emit('message', new Message_1.Message(message, this));
        });
    }
    sendMessage(channelID, data) {
        if (typeof data == 'string')
            data = { content: data };
        node_fetch_1.default(`https://chat-gateway.veld.dev/api/v1/channels/${channelID}/messages`, {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${this.token}` },
            body: JSON.stringify(data)
        });
        return true;
    }
}
exports.Client = Client;
