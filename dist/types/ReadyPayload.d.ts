import RawUser from './RawUser';
import RawChannel from './RawChannel';
declare type ReadyPayload = {
    user: RawUser;
    members: RawUser[];
    channels: RawChannel[];
    token: string;
    mainChannel: string;
};
export default ReadyPayload;
