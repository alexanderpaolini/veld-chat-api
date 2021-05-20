import Collection from '@discordjs/collection'
import { EventEmitter } from '@jpbberry/typed-emitter'

import { Client, Message } from '..'

interface CommandContextOptions {
  message: Message
  command: Command
}

export class CommandContext<Args = any> {
  /**
   * The message which called the command
   */
  message: Message
  /**
   * Command arguments
   */
  args: Args[]
  /**
   * The command
   */
  command: Command

  /**
   * Not sure tbh
   * @param opts The options
   */
  constructor (opts: CommandContextOptions) {
    this.message = opts.message

    this.command = opts.command
    this.args = (this.message.content?.split(' ') ?? []) as any as Args[]

    this.args.shift()
  }
}

export interface HandlerEvents {
  COMMAND_ERROR: [CommandContext, any]
  COMMAND_RAN: [CommandContext, any]
  NO_COMMAND: [Message]
}

export interface CommandHandlerOptions {
  prefix: string
}

export class CommandHandler extends EventEmitter<HandlerEvents> {
  /**
   * Commands
   */
  commands = new Collection<string, Command>()
  /**
   * Aliases
   */
  aliases = new Map<string, string>()

  /**
   * A Command handler
   * @param options The options
   */
  constructor (private readonly client: Client, public readonly options: CommandHandlerOptions) {
    super()

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.client.on('message', this.run.bind(this))
  }

  addCommand (cmd: Command): this {
    this.commands.set(cmd.name, cmd)
    return this
  }

  async run (msg: Message): Promise<void> {
    if (!msg.content?.startsWith(this.options.prefix.toLowerCase())) return

    const command = msg.content?.split(' ').pop() ?? ''
    const cmd = this.commands.get(command)
    if (!cmd) {
      this.emit('NO_COMMAND', msg)
      return
    }

    const ctx = new CommandContext({
      command: cmd,
      message: msg
    })

    try {
      const response = await cmd.exec(ctx)

      this.emit('COMMAND_RAN', ctx, response)
    } catch (err) {
      this.emit('COMMAND_ERROR', ctx, err)
    }
  }
}

export interface Command<K = any, Args = any> {
  name: string
  aliases?: string[]
  onError?: (ctx: CommandContext<Args>, err: any) => any | Promise<any>
  onRun?: (ctx: CommandContext<Args>, response: K) => any | Promise<any>
  exec: (ctx: CommandContext<Args>) => K | Promise<K>
}
