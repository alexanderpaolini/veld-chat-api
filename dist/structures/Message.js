"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
/**
 * Message Class
 */
class Message {
    constructor(data, client) {
        this.client = client;
        this.id = data.id;
        this.content = data.content;
        this.embed = data.embed;
        this.author = new User_1.default(data.author);
        this.timestamp = new Date(data.timestamp);
        this.channel = client.cache.channels.get(data.channelId);
    }
}
exports.default = Message;
