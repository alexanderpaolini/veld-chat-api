import RawUser from "../types/RawUser";
declare class User {
    id: string;
    name: string;
    avatarURL: string | null;
    bot: boolean;
    constructor(data: RawUser);
}
export default User;
