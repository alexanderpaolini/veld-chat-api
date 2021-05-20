import Collection from '@discordjs/collection';
import { Cache } from '@jpbberry/cache';
import Channel from './Channel';
import Message from './Message';
import User from './User';
/**
 * Cache options
 */
export interface CacheOptions {
    /**
     * Whether or not to cache channels
     */
    channels: boolean;
    /**
     * Whether or not to cache users
     */
    users: boolean;
}
/**
 * The cache handler.
 * Handles cache ofc
 */
export declare class CacheHandler {
    channels: Collection<string, Channel>;
    users: Collection<string, User>;
    messages: Cache<string, Message>;
    /**
     * Clear all cache.
     * This probably shouldn't be used
     */
    clear(): void;
}
