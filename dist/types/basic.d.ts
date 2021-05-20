export declare enum MessageType {
    Authorize = 0,
    Ready = 1,
    MessageCreate = 2,
    MessageUpdate = 3,
    MessageDelete = 4,
    UserUpdate = 8,
    MemberCreate = 9,
    MemberDelete = 11,
    PresenceUpdate = 12,
    Heartbeat = 1000,
    HeartbeatAck = 1001
}
export interface WebSocketPayload {
    t: MessageType;
    d: any;
}
export interface APIEmbed {
    author?: EmbedAuthor;
    title?: string;
    description?: string;
    color?: number;
    footer?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
}
export interface EmbedAuthor {
    value: string;
    iconUrl: string;
}
