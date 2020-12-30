import RawChannel from "../types/RawChannel";
import RawUser from "../types/RawUser";
import { Client } from "./Client";
export declare class Channel {
    id: string;
    system: boolean;
    name: string;
    members: RawUser[];
    client: Client;
    constructor(data: RawChannel, client: Client);
    send(data: string | object): Promise<boolean>;
}
