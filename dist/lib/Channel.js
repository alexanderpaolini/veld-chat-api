"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
class Channel {
    constructor(data, client) {
        this.id = data.id;
        this.system = data.system;
        this.name = data.name;
        this.members = data.members;
        this.client = client;
    }
    async send(data) {
        return this.client.sendMessage(this.id, data);
    }
}
exports.Channel = Channel;
