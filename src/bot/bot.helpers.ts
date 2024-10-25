import { Context } from "telegraf";
import { Message } from "telegraf/types";

export type RightsCheckHookReturnType = {
  check: () => Promise<boolean>;
  targetId: number | null;
};

export function useRightsCheck(
  ctx: Context,
  adminTelegramId: number
): RightsCheckHookReturnType {
  const targetId =
    (ctx.message as Message.TextMessage).reply_to_message?.from?.id ?? null;

  async function check(): Promise<boolean> {
    if (ctx.message?.from.id !== adminTelegramId) {
      const msg = "У ТЕБЯ НЕТ ЗДЕСЬ ВЛАСТИ.";
      await ctx.react("🖕");
      await ctx.reply(msg, {
        entities: [{ offset: 0, length: msg.length, type: "bold" }],
      });

      return false;
    }

    if (!targetId) {
      const msg =
        "СООБЩЕНИЕ НЕОБХОДИМО ИСПОЛЬЗОВАТЬ В ОТВЕТ НА ЧУЖОЕ СООБЩЕНИЕ.";
      await ctx.react("💩");
      await ctx.reply(msg, {
        entities: [{ offset: 0, length: msg.length, type: "bold" }],
      });
      return false;
    }

    return true;
  }

  return { check, targetId: targetId };
}

export async function replyToMessage(
  ctx: Context,
  message: string
): Promise<void> {
  await ctx.reply(message, {
    entities: [
      {
        offset: 0,
        length: message.length,
        type: "bold",
      },
    ],
  });
}
