import RawUser from './RawUser';

type RawChannel = {
  id: string,
  system: boolean,
  name: string,
  members: RawUser[]
}

export default RawChannel;