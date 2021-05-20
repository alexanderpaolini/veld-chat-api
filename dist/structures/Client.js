"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const ws_1 = __importDefault(require("ws"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Channel_1 = __importDefault(require("./Channel"));
const Message_1 = __importDefault(require("./Message"));
const User_1 = __importDefault(require("./User"));
const types_1 = require("../types");
const CacheHandler_1 = require("./CacheHandler");
const CommandHandler_1 = require("./CommandHandler");
class Client extends events_1.EventEmitter {
    constructor(options) {
        super();
        /**
         * Whether or not the client is connected
         */
        this.isConnected = false;
        /**
         * The cache handler
         */
        this.cache = new CacheHandler_1.CacheHandler();
        /**
         * Ping updated on every fetch request
         */
        this.restPing = 0;
        this.options = Object.assign(options !== null && options !== void 0 ? options : {}, {
            host: 'api.veld.chat',
            heartbeatInterval: 15000,
            cache: {
                channels: true,
                users: true
            },
            commandOptions: {
                prefix: '!'
            }
        });
        this.isConnected = false;
        this.websocket = new ws_1.default(`wss://${this.options.host}`);
        this.commands = new CommandHandler_1.CommandHandler(this, this.options.commandOptions);
    }
    connect(token) {
        this.token = token;
        if (this.isConnected)
            return;
        this.websocket.on('open', () => {
            this.isConnected = true;
            this.websocket.send(JSON.stringify({
                t: types_1.MessageType.Authorize,
                d: {
                    token: this.token,
                    bot: true
                }
            }));
            setInterval(() => {
                if (!this.isConnected)
                    return;
                this.websocket.send(JSON.stringify({
                    t: types_1.MessageType.Heartbeat,
                    d: null
                }));
            }, this.options.heartbeatInterval);
        });
        this.websocket.on('error', (err) => {
            console.log('error', err);
        });
        this.websocket.on('close', () => {
            this.isConnected = false;
            throw new Error('Websocket closed');
        });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.websocket.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const payload = JSON.parse(data.toString());
            this.emit('raw', payload);
            switch (payload.t) {
                // Authorize is 0
                case types_1.MessageType.Authorize:
                    break;
                // Ready is 1
                case types_1.MessageType.Ready: {
                    this.user = new User_1.default(payload.d.user);
                    payload.d.channels.forEach((channel) => {
                        this.cache.channels.set(channel.id, new Channel_1.default(channel, this));
                    });
                    this.emit('ready', this.user);
                    yield this.fetchUsers('1').then((users) => {
                        users.forEach((user) => {
                            this.cache.users.set(user.id, new User_1.default(user));
                        });
                    });
                    break;
                }
                // MessageCreate is 2
                case types_1.MessageType.MessageCreate:
                    if (this.options.cache.users)
                        this.cache.users.set(payload.d.author.id, new User_1.default(payload.d.author));
                    this.emit('message', new Message_1.default(payload.d, this));
                    break;
                // Message Update is 3
                case types_1.MessageType.MessageUpdate: {
                    break;
                }
                // Message Delete is 4
                case types_1.MessageType.MessageDelete: {
                    break;
                }
                // User Update is 8
                case types_1.MessageType.UserUpdate: {
                    const oldUser = (_a = this.cache.users.get(payload.d.id)) !== null && _a !== void 0 ? _a : {};
                    const newUser = new User_1.default(payload.d);
                    if (this.options.cache.users)
                        this.cache.users.set(newUser.id, newUser);
                    this.emit('userUpdate', oldUser, newUser);
                    break;
                }
                // Member Create is 9
                case types_1.MessageType.MemberCreate:
                    break;
                // Member Delete is 11
                case types_1.MessageType.MemberDelete:
                    break;
                // Presense Update is 12
                case types_1.MessageType.PresenceUpdate:
                    switch (payload.d.statusType) {
                        // Online is 0
                        case types_1.StatusType.Online: {
                            const onlineUser = new User_1.default(payload.d.user);
                            if (this.options.cache.users)
                                this.cache.users.set(onlineUser.id, onlineUser);
                            this.emit('statusUpdate', { text: payload.d.statusText, type: payload.d.statusType }, onlineUser, null);
                            break;
                        }
                        // Offline is 1
                        case types_1.StatusType.Offline: {
                            const offlineUser = (_b = this.cache.users.get(payload.d.user.id)) !== null && _b !== void 0 ? _b : {};
                            this.cache.users.delete(payload.d.user.id);
                            this.emit('statusUpdate', { text: payload.d.statusText, type: payload.d.statusType }, null, offlineUser);
                            break;
                        }
                    }
                    break;
                // Heartbeat is 1000
                case types_1.MessageType.Heartbeat:
                    this.emit('debug', '[Websocket] Sent Heartbeat');
                    break;
                // HeartbeatAck is 1001
                case types_1.MessageType.HeartbeatAck:
                    this.emit('debug', '[Websocket] HeartbeatAck?');
                    break;
            }
            return false;
        }));
    }
    _request(method, url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield node_fetch_1.default('https://' + this.options.host + '/' + url, {
                method: method,
                headers: { 'content-type': 'application/json', authorization: `Bearer ${this.token}` },
                body: body ? JSON.stringify(body) : undefined
            });
        });
    }
    fetchUsers(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._request('GET', `channels/${channelID}/members`, null).then((req) => __awaiter(this, void 0, void 0, function* () { return req.json(); }));
        });
    }
    sendMessage(channelID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof data === 'string')
                data = { content: data };
            return yield this._request('POST', `channels/${channelID}/messages`, data).then((req) => __awaiter(this, void 0, void 0, function* () { return req.json(); }));
        });
    }
    // channelID soon™️ - Veld
    joinChannel(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = { channel: channelName };
            return yield this._request('POST', 'channels/join', body);
        });
    }
}
exports.default = Client;
