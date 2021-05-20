import { APIUser } from '../types/user';
/**
 * User Class
 */
declare class User {
    /**
     * The ID of the user
     */
    id: string;
    /**
     * The name of the user
     */
    name: string;
    /**
     * The user's avatar URL
     */
    avatarUrl: string | null;
    /**
     * Whether or not the user is a bot
     */
    bot: boolean;
    /**
     * The user's badges
     */
    badges: string[];
    constructor(data: APIUser);
}
export default User;
