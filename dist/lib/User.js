"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.avatarURL = `https://cdn.miki.bot/chat/avatars/${Number(this.id) % 5}.png`;
        this.bot = data.isBot;
    }
}
exports.default = User;
