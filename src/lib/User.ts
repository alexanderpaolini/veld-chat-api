import RawUser from "../types/RawUser";

class User {
  id: string;
  name: string;
  avatarURL: string | null;
  bot: boolean;
  constructor(data: RawUser) {
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarUrl;
    this.bot = data.isBot;
  }
}

export default User;
