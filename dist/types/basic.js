"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Authorize"] = 0] = "Authorize";
    MessageType[MessageType["Ready"] = 1] = "Ready";
    MessageType[MessageType["MessageCreate"] = 2] = "MessageCreate";
    MessageType[MessageType["MessageUpdate"] = 3] = "MessageUpdate";
    MessageType[MessageType["MessageDelete"] = 4] = "MessageDelete";
    MessageType[MessageType["UserUpdate"] = 8] = "UserUpdate";
    MessageType[MessageType["MemberCreate"] = 9] = "MemberCreate";
    MessageType[MessageType["MemberDelete"] = 11] = "MemberDelete";
    MessageType[MessageType["PresenceUpdate"] = 12] = "PresenceUpdate";
    MessageType[MessageType["Heartbeat"] = 1000] = "Heartbeat";
    MessageType[MessageType["HeartbeatAck"] = 1001] = "HeartbeatAck";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
