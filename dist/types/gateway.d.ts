import { APIMessage, APIChannel, APIUser } from '.';
export interface APIGatewayAuthorizeEvent {
}
export interface APIGatewayReadyEvent {
    user: APIUser;
    channels: APIChannel[];
}
export interface APIGatewayMessageCreateEvent extends APIMessage {
}
export interface APIGatewayMessageUpdateEvent extends APIMessage {
}
export interface APIGatewayMessageDeleteEvent extends APIMessage {
}
export interface APIGatewayUserUpdateEvent extends APIUser {
}
export interface APIGatewayMemberCreateEvent extends APIUser {
}
export interface APIGatrwayMemberDeleteEvent extends APIUser {
}
export interface APIGatewayPresenceUpdateEvent extends APIUser {
}
export interface APIGatewayHeartbeatEvent {
}
export interface APIGatewayHeartbeatAckEvent {
}
