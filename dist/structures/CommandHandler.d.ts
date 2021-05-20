import Collection from '@discordjs/collection';
import { EventEmitter } from '@jpbberry/typed-emitter';
import { Client, Message } from '..';
interface CommandContextOptions {
    message: Message;
    command: Command;
}
export declare class CommandContext<Args = any> {
    /**
     * The message which called the command
     */
    message: Message;
    /**
     * Command arguments
     */
    args: Args[];
    /**
     * The command
     */
    command: Command;
    /**
     * Not sure tbh
     * @param opts The options
     */
    constructor(opts: CommandContextOptions);
}
export interface HandlerEvents {
    COMMAND_ERROR: [CommandContext, any];
    COMMAND_RAN: [CommandContext, any];
    NO_COMMAND: [Message];
}
export interface CommandHandlerOptions {
    prefix: string;
}
export declare class CommandHandler extends EventEmitter<HandlerEvents> {
    private readonly client;
    readonly options: CommandHandlerOptions;
    /**
     * Commands
     */
    commands: Collection<string, Command<any, any>>;
    /**
     * Aliases
     */
    aliases: Map<string, string>;
    /**
     * A Command handler
     * @param options The options
     */
    constructor(client: Client, options: CommandHandlerOptions);
    addCommand(cmd: Command): this;
    run(msg: Message): Promise<void>;
}
export interface Command<K = any, Args = any> {
    name: string;
    aliases?: string[];
    onError?: (ctx: CommandContext<Args>, err: any) => any | Promise<any>;
    onRun?: (ctx: CommandContext<Args>, response: K) => any | Promise<any>;
    exec: (ctx: CommandContext<Args>) => K | Promise<K>;
}
export {};
