"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User Class
 */
class User {
    constructor(data) {
        var _a;
        this.id = data.id;
        this.name = data.name;
        this.avatarUrl = `https://cdn.miki.bot/chat/avatars/${(_a = data.avatarUrl) !== null && _a !== void 0 ? _a : Number(this.id) % 5}.png`;
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
