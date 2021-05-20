export interface APIUser {
    id: string;
    name: string;
    avatarUrl: string;
    badges: UserBadges;
    isBot: boolean;
    status?: UserStatus;
}
export interface UserStatus {
    statusText?: string;
    statusType: StatusType;
}
export declare enum StatusType {
    Online = 0,
    Offline = 1
}
export declare enum UserBadges {
    None = 0,
    Supporter = 1,
    Admin = 2,
    Bot = 4
}
