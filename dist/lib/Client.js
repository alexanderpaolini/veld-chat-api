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
    MessageType[MessageType["Heartbeat"] = 1000] = "Heartbeat";
    MessageType[MessageType["HeartbeatAck"] = 1001] = "HeartbeatAck";
})(MessageType || (MessageType = {}));
class Client extends events_1.EventEmitter {
    constructor(options) {
        super();
        // Get the default options correct
        this.options = Object.assign(options || {}, { host: 'api.veld.chat', heartbeatInterval: 15000 });
        // Make sure it connects
        this.isConnected = false;
        // Define the cache (use FakeMap later for easier use)
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
        this.websocket.on('close', (code, reason) => {
            this.isConnected = false;
            this.connect(this.token);
        });
        this.websocket.on('message', (data) => {
            const payload = JSON.parse(data.toString());
            this.emit('raw', payload);
            switch (payload.t) {
                case MessageType.Authorize:
                    break;
                case MessageType.Ready:
                    this.user = new User_1.default(payload.d.user);
                    payload.d.channels.forEach(channel => {
                        this.cache.channels[channel.id] = new Channel_1.default(channel, this);
                    });
                    this.cache.users[this.user.id] = this.user;
                    this.emit('ready', this.user);
                    this.fetchUsers('1');
                    // if(!this.user.bot) while (true) {};
                    break;
                case MessageType.MessageCreate:
                    this.emit('message', new Message_1.default(payload.d, this));
                    break;
                case MessageType.MessageUpdate:
                    break;
                case MessageType.MessageDelete:
                    break;
                case MessageType.UserUpdate:
                    const oldUser = this.cache.users[payload.d.id];
                    const newUser = new User_1.default(payload.d);
                    this.cache.users[newUser.id] = newUser;
                    this.emit('userUpdate', oldUser, newUser);
                    break;
                case MessageType.Heartbeat:
                    this.emit('debug', '[Websocket] Sent Heartbeat');
                    break;
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
            data['content'] = data['content'] || '';
            return yield this._request('POST', `channels/${channelID}/messages`, data);
        });
    }
}
exports.default = Client;
