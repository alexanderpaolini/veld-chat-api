import RawUser from './RawUser';
import RawChannel from './RawChannel';

type ReadyPayload = {
  user: RawUser,
  members: RawUser[],
  channels: RawChannel[],
  token: string,
  mainChannel: string,
}

export default ReadyPayload;