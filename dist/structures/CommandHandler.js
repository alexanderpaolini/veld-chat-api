"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = exports.CommandContext = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const typed_emitter_1 = require("@jpbberry/typed-emitter");
class CommandContext {
    /**
     * Not sure tbh
     * @param opts The options
     */
    constructor(opts) {
        var _a, _b;
        this.message = opts.message;
        this.command = opts.command;
        this.args = ((_b = (_a = this.message.content) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : []);
        this.args.shift();
    }
}
exports.CommandContext = CommandContext;
class CommandHandler extends typed_emitter_1.EventEmitter {
    /**
     * A Command handler
     * @param options The options
     */
    constructor(client, options) {
        super();
        this.client = client;
        this.options = options;
        /**
         * Commands
         */
        this.commands = new collection_1.default();
        /**
         * Aliases
         */
        this.aliases = new Map();
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.client.on('message', this.run.bind(this));
    }
    addCommand(cmd) {
        this.commands.set(cmd.name, cmd);
        return this;
    }
    run(msg) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = msg.content) === null || _a === void 0 ? void 0 : _a.startsWith(this.options.prefix.toLowerCase())))
                return;
            const command = (_c = (_b = msg.content) === null || _b === void 0 ? void 0 : _b.split(' ').pop()) !== null && _c !== void 0 ? _c : '';
            const cmd = this.commands.get(command);
            if (!cmd) {
                this.emit('NO_COMMAND', msg);
                return;
            }
            const ctx = new CommandContext({
                command: cmd,
                message: msg
            });
            try {
                const response = yield cmd.exec(ctx);
                this.emit('COMMAND_RAN', ctx, response);
            }
            catch (err) {
                this.emit('COMMAND_ERROR', ctx, err);
            }
        });
    }
}
exports.CommandHandler = CommandHandler;
