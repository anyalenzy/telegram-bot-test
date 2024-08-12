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
        [
          Markup.button.callback(
            "Залишити контактні дані",
            "enter_contact_info"
          ),
        ],
        [Markup.button.callback("<< Назад", "back")],
      ])
    );
  }
});

contactFormScene.action("enter_contact_info", async (ctx) => {
  await ctx.scene.enter("nameScene");
});

contactFormScene.action("back", (ctx) => {
  ctx.scene.enter("worksScene");
});
