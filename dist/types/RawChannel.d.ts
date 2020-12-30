import RawUser from './RawUser';
declare type RawChannel = {
    id: string;
    system: boolean;
    name: string;
    members: RawUser[];
};
export default RawChannel;
