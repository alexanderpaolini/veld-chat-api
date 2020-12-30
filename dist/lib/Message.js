"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const Channel_1 = require("./Channel");
class Message {
    constructor(data, client) {
        this.id = data.id;
        this.channel = new Channel_1.Channel(client.channels.get(data.channelId), client);
        this.user = client.users.get(data.user);
        this.content = data.content;
        this.client = client;
        this.mentions = data.mentions;
    }
}
exports.Message = Message;
