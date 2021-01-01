import RawUser from "./RawUser";

type RawMessage = {
  id: string;
  embed: null;
  content: string;
  author: RawUser;
  timestamp: string;
  channelId: string;
}

export default RawMessage;