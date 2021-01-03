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
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Authorize"] = 0] = "Authorize";
    MessageType[MessageType["Ready"] = 1] = "Ready";
    MessageType[MessageType["MessageCreate"] = 2] = "MessageCreate";
    MessageType[MessageType["MessageUpdate"] = 3] = "MessageUpdate";
    MessageType[MessageType["MessageDelete"] = 4] = "MessageDelete";
    MessageType[MessageType["UserUpdate"] = 8] = "UserUpdate";
    MessageType[MessageType["MemberCreate"] = 9] = "MemberCreate";
    MessageType[MessageType["MemberDelete"] = 11] = "MemberDelete";
    MessageType[MessageType["PresenceUpdate"] = 12] = "PresenceUpdate";
    MessageType[MessageType["Heartbeat"] = 1000] = "Heartbeat";
    MessageType[MessageType["HeartbeatAck"] = 1001] = "HeartbeatAck";
})(MessageType || (MessageType = {}));
class Client extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = Object.assign(options || {}, { host: 'api.veld.chat', heartbeatInterval: 15000 });
        this.isConnected = false;
        this.cache = {
            channels: {},
            users: {}
        };
    }
    connect(token) {
        this.token = token;
        if (this.isConnected)
            return;
        this.websocket = new ws_1.default(`wss://${this.options.host}`);
        this.websocket.on('open', () => {
            this.isConnected = true;
            this.websocket.send(JSON.stringify({
                t: MessageType.Authorize,
                d: {
                    token: this.token,
                    bot: true,
                }
            }));
            setInterval(() => {
                if (!this.isConnected)
                    return;
                this.websocket.send(JSON.stringify({
                    t: MessageType.Heartbeat,
                    d: null,
                }));
            }, this.options.heartbeatInterval);
        });
        this.websocket.on('error', (err) => {
            console.log("error", err);
        });
        this.websocket.on('close', () => {
            this.isConnected = false;
            throw new Error('Token is incorrect.');
        });
        this.websocket.on('message', (data) => {
            const payload = JSON.parse(data.toString());
            this.emit('raw', payload);
            switch (payload.t) {
                // Authorize is 0
                case MessageType.Authorize:
                    break;
                // Ready is 1
                case MessageType.Ready:
                    this.user = new User_1.default(payload.d.user);
                    payload.d.channels.forEach((channel) => {
                        this.cache.channels[channel.id] = new Channel_1.default(channel, this);
                    });
                    this.cache.users[this.user.id] = this.user;
                    this.emit('ready', this.user);
                    this.fetchUsers('1').then((users) => {
                        users.forEach((user) => {
                            this.cache.users[user.id] = new User_1.default(user);
                        });
                    });
                    // while (!this.user.bot) {};
                    break;
                // MessageCreate is 2
                case MessageType.MessageCreate:
                    this.cache.users[payload.d.author.id] = new User_1.default(payload.d.author);
                    this.emit('message', new Message_1.default(payload.d, this));
                    break;
                // Message Update is 3
                case MessageType.MessageUpdate:
                    break;
                // Message Delete is 4
                case MessageType.MessageDelete:
                    break;
                // User Update is 8
                case MessageType.UserUpdate:
                    const oldUser = this.cache.users[payload.d.id];
                    const newUser = new User_1.default(payload.d);
                    this.cache.users[newUser.id] = newUser;
                    this.emit('userUpdate', oldUser, newUser);
                    break;
                // Member Create is 9
                case MessageType.MemberCreate:
                    break;
                // Member Delete is 11
                case MessageType.MemberDelete:
                    break;
                // Presense Update is 12
                case MessageType.PresenceUpdate:
                    break;
                // Heartbeat is 1000
                case MessageType.Heartbeat:
                    this.emit('debug', '[Websocket] Sent Heartbeat');
                    break;
                // HeartbeatAck is 1001
                case MessageType.HeartbeatAck:
                    this.emit('debug', '[Websocket] HeartbeatAck?');
                    break;
            }
            return false;
        });
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
            return yield this._request('GET', `channels/${channelID}/members`, null).then((req) => __awaiter(this, void 0, void 0, function* () { return yield req.json(); }));
        });
    }
    sendMessage(channelID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof data == 'string')
                data = { content: data };
            return yield this._request('POST', `channels/${channelID}/messages`, data).then((req) => __awaiter(this, void 0, void 0, function* () { return yield req.json(); }));
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
