"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadges = exports.StatusType = void 0;
var StatusType;
(function (StatusType) {
    StatusType[StatusType["Online"] = 0] = "Online";
    StatusType[StatusType["Offline"] = 1] = "Offline";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
var UserBadges;
(function (UserBadges) {
    UserBadges[UserBadges["None"] = 0] = "None";
    UserBadges[UserBadges["Supporter"] = 1] = "Supporter";
    UserBadges[UserBadges["Admin"] = 2] = "Admin";
    UserBadges[UserBadges["Bot"] = 4] = "Bot";
})(UserBadges = exports.UserBadges || (exports.UserBadges = {}));
