"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.avatarURL = `https://cdn.miki.bot/chat/avatars/${Number(this.id) % 5}.png`;
        this.bot = (data.badges & 4) === 4;
        this.badges = [];
        if ((data.badges & 4) === 4)
            this.badges.push('bot');
        if ((data.badges & 2) === 2)
            this.badges.push('admin');
        if ((data.badges & 1) === 1)
            this.badges.push('supporter');
    }
}
exports.default = User;
