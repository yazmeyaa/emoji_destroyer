import { Composer, Context, MiddlewareFn, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Config } from "../config/config";
import { Update } from "telegraf/typings/core/types/typegram";
import { UserService } from "../user/user.service";
import { ChatService } from "../chat/chat.service";
import { RestrictionService } from "../restriction/restriction.service";
import { UserRestrictionEnum } from "../restriction/user_chat_restriction.model";

export type CommandType = MiddlewareFn<Context<Update>>;

export class BotService {
  private userSerivce: UserService;
  private chatService: ChatService;
  private restrctionService: RestrictionService;
  private bot: Telegraf;

  constructor(config: Config) {
    this.userSerivce = UserService.getInstance();
    this.chatService = ChatService.getInstance();
    this.restrctionService = RestrictionService.getInstance();
    this.bot = new Telegraf(config.telegram.token);
  }

  private onSilence(): CommandType {
    return Composer.command(/silence/, async (ctx) => {
      if (ctx.message.from.id !== 279603779) {
        const msg = "У ТЕБЯ НЕТ ЗДЕСЬ ВЛАСТИ.";
        await ctx.react("🖕");
        await ctx.reply(msg, {
          entities: [{ offset: 0, length: msg.length, type: "bold" }],
        });
        return;
      }
      const targetId = ctx.message.reply_to_message?.from?.id;
      if (!targetId) {
        const msg =
          "СООБЩЕНИЕ НЕОБХОДИМО ИСПОЛЬЗОВАТЬ В ОТВЕТ НА ЧУЖОЕ СООБЩЕНИЕ.";
        await ctx.react("💩");
        await ctx.reply(msg, {
          entities: [{ offset: 0, length: msg.length, type: "bold" }],
        });
        return;
      }

      const user = await this.userSerivce.getUser(targetId);
      const chat = await this.chatService.getChat(ctx.chat.id);
      await this.restrctionService.restrictUser(
        user,
        chat,
        UserRestrictionEnum.NoPremiumEmojis
      );

      const okMessage =
        "ВЫПОЛНЕНО. ПОЛЬЗОВАТЕЛЬ БОЛЬШЕ НЕ СМОЖЕТ ПОЛЬЗОВАТЬСЯ ПРЕМИУМ ЭМОДЖИ.";
      await ctx.react("⚡");
      await ctx.reply(okMessage, {
        entities: [
          {
            offset: 0,
            length: okMessage.length,
            type: "bold",
          },
        ],
      });
    });
  }

  private onInfo(): CommandType {
    return Composer.command(/info/, async (ctx) => {
      const userId = ctx.message.from.id;
      if (!userId) return;
      const user = await this.userSerivce.getUser(userId);
      const restrictions = await this.restrctionService.getUserRestrictions(
        user
      );

      if (restrictions.length === 0) {
        const msg = "У ТЕБЯ НЕТ ОГРАНИЧЕНИЙ.";
        await ctx.react("🏆");
        await ctx.reply(msg, {
          entities: [{ offset: 0, length: msg.length, type: "bold" }],
        });
        return;
      }

      const parts: string[] = ["ТВОИ ОГРАНИЧЕНИЯ:\n"];
      restrictions.forEach((x) => {
        parts.push(`- ${x.getString()};`);
      });

      const msg = parts.join("\n");
      await ctx.react("🤪");
      await ctx.reply(msg, {
        entities: [{ offset: 0, length: msg.length, type: "bold" }],
      });
    });
  }

  private configureCommands(): void {
    this.bot.use(this.onSilence(), this.onInfo());
  }

  public async start(): Promise<void> {
    this.configureCommands();
    this.bot.on(message("new_chat_members"), async (ctx) => {
      await this.chatService.getChat(ctx.chat.id);
      const members = ctx.message.new_chat_members;

      members.forEach((x) => {
        if (ctx.botInfo.id === x.id) {
          const msg = "ПРИВЕТ.";
          ctx.sendMessage(msg, {
            entities: [{ offset: 0, length: msg.length, type: "bold" }],
          });
        }
      });
    });

    this.bot.use((ctx, next) => {
      next();
    });

    this.bot.on("message", async (ctx) => {
      const userId = ctx.message.from.id;
      if (!userId) return;
      const user = await this.userSerivce.getUser(userId);
      const restrictions = await this.restrctionService.getUserRestrictions(
        user
      );
      if (restrictions.length === 0) return;

      if (
        restrictions.some(
          (x) => x.restriction === UserRestrictionEnum.NoPremiumEmojis
        )
      ) {
        if (ctx.entities().some((x) => x.type === "custom_emoji")) {
          const msg = "ТЕБЕ НЕ РАЗРЕШЕНЫ ПРЕМИУМ ЭМОДЗИ.";
          await ctx.deleteMessage(ctx.message.message_id);
          await ctx.sendMessage(msg, {
            entities: [{ offset: 0, length: msg.length, type: "bold" }],
          });
        }
      }
    });
    return this.bot.launch();
  }
}
