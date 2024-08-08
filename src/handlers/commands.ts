import { Markup } from "telegraf";
import { MyContext } from "../types";

export const startHandler = (ctx: MyContext) => {
  ctx.reply(
    "Добрий день! Ми допоможемо вам швидко оформити заявку на будівельні роботи за програмою е-відновлення."
  );
  ctx.scene.enter("objectScene");
};
