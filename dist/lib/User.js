"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.avatarURL = data.avatarUrl;
        this.bot = data.isBot;
    }
}
exports.default = User;
