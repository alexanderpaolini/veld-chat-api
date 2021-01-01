import RawUser from "./RawUser";
declare type RawMessage = {
    id: string;
    embed: null;
    content: string;
    author: RawUser;
    timestamp: string;
    channelId: string;
};
export default RawMessage;
