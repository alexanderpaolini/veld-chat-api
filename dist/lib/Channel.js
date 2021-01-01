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
Object.defineProperty(exports, "__esModule", { value: true });
class Channel {
    constructor(data, client) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.members = data.members;
        this.messages = data.messages;
        this._client = client;
    }
    send(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._client.sendMessage(this.id, data);
        });
    }
    fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._client.fetchUsers(this.id);
        });
    }
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._client.joinChannel(this.name);
        });
    }
}
exports.default = Channel;
