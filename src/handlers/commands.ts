import { Markup, Context } from "telegraf";

export const startHandler = (ctx: Context) => {
  ctx.reply(
    "Добрий день! Ми допоможемо вам швидко оформити заявку на будівельні роботи за програмою е-відновлення.",
    Markup.inlineKeyboard([[Markup.button.callback("Продовжити", "continue")]])
  );
};
