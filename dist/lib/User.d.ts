import RawUser from "../types/RawUser";
declare class User {
    id: string;
    name: string;
    avatarURL: string | null;
    bot: boolean;
    badges: string[];
    constructor(data: RawUser);
}
export default User;
