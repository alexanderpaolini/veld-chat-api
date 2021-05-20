export type APIUser = {
  id: string
  name: string
  avatarUrl: string
  badges: UserBadges
  isBot: boolean
  status?: UserStatus
}

export type UserStatus = {
  statusText?: string
  statusType: StatusType
}

export enum StatusType {
  Online = 0,
  Offline = 1
}

export enum UserBadges {
  None = 0,
  Supporter = 1,
  Admin = 2,
  Bot = 4,
}
