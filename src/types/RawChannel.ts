import RawMessage from "./RawMessage";
import RawUser from "./RawUser";

type RawChannel = {
  id: string,
  name: string,
  type: null,
  members: RawUser[] | null;
  messages: RawMessage[] | null;
}

export default RawChannel;