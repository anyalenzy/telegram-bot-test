import { Scenes, Markup } from "telegraf";
import { MyContext } from "../types";

export const contactFormScene = new Scenes.BaseScene<MyContext>(
  "contactFormScene"
);

contactFormScene.enter(async (ctx) => {
  const selectedWorks = ctx.session.userData.works || [];
  if (selectedWorks.length) {
    const selectedWorksText = `Ви обрали наступні види робіт: ${selectedWorks.join(
      ", "
    )}. Для розгляду Вашої заявки заповніть наступну контактну форму.`;
    await ctx.editMessageText(
      selectedWorksText,
      Markup.inlineKeyboard([
        Markup.button.callback("Залишити контактні дані", "контакти"),
      ])
    );
  }
});
