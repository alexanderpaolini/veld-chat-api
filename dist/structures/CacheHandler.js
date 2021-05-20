"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheHandler = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const cache_1 = require("@jpbberry/cache");
/**
 * The cache handler.
 * Handles cache ofc
 */
class CacheHandler {
    constructor() {
        this.channels = new collection_1.default();
        this.users = new collection_1.default();
        this.messages = new cache_1.Cache(30e3);
    }
    /**
     * Clear all cache.
     * This probably shouldn't be used
     */
    clear() {
        this.channels.clear();
        this.users.clear();
        this.messages.clear();
    }
}
exports.CacheHandler = CacheHandler;
