import RawChannel from "../types/RawChannel";
import RawMessage from "../types/RawMessage";
import RawUser from "../types/RawUser";
import Client from "./Client";
declare class Channel {
    id: string;
    name: string;
    type: number;
    members: RawUser[] | null;
    messages: RawMessage[] | null;
    private _client;
    constructor(data: RawChannel, client: Client);
    send(data: string | object): Promise<any>;
    fetchUsers(): Promise<any>;
    join(): Promise<any>;
}
export default Channel;
