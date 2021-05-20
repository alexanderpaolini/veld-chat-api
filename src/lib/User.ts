import { APIUser } from "../types/user";

/**
 * User Class
 */
class User {
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

  constructor(data: APIUser) {
    this.id = data.id;
    this.name = data.name;
    this.avatarUrl = `https://cdn.miki.bot/chat/avatars/${data.avatarUrl ?? Number(this.id) % 5}.png`;
    this.bot = (data.badges & 4) === 4;
    this.badges = [];

    if((data.badges & 4) === 4) this.badges.push('bot')
    if ((data.badges & 2) === 2) this.badges.push('admin');
    if ((data.badges & 1) === 1) this.badges.push('supporter');
  }
}

export default User;
