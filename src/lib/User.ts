import RawUser from "../types/RawUser";

class User {
  id: string;
  name: string;
  avatarURL: string | null;
  bot: boolean;
  badges: string[];
  constructor(data: RawUser) {
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = `https://cdn.miki.bot/chat/avatars/${Number(this.id) % 5}.png`;
    this.bot = (data.badges & 4) === 4;
    this.badges = [];
    if((data.badges & 4) === 4) this.badges.push('bot')
    if ((data.badges & 2) === 2) this.badges.push('admin');
    if ((data.badges & 1) === 1) this.badges.push('supporter');
  }
}

export default User;
