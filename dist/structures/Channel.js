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
/**
 * Channel Class
 */
class Channel {
    constructor(data, client) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        // Not sure if this is a thing
        // this.type = data.type;
        this.members = data.members;
        this.messages = data.messages;
    }
    /**
     * Send a message to a channel
     * @param data Data to send to the channel
     */
    send(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.sendMessage(this.id, data);
        });
    }
    /**
     * Fetch the users in a channel
     */
    fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.fetchUsers(this.id);
        });
    }
    /**
     * Join the channel
     */
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.joinChannel(this.name);
        });
    }
}
exports.default = Channel;
