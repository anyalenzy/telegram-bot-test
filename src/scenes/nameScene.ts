import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext } from "../types";

export const nameScene = new Scenes.BaseScene<MyContext>("nameScene");

nameScene.enter(async (ctx) => {
  const firstName = ctx.from?.first_name || "";
  const lastName = ctx.from?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  ctx.session.userData.contactInfo = {
    ...ctx.session.userData.contactInfo,
    name: "",
    phone: "",
    address: "",
  };

  await ctx.editMessageText(
    `Ваше ім'я: ${fullName}. Це правильне ім'я?`,
    Markup.inlineKeyboard([
      [Markup.button.callback("Так", "confirm_name")],
      [Markup.button.callback("Ні", "edit_name")],
    ])
  );
});

nameScene.action("confirm_name", async (ctx) => {
  const firstName = ctx.from?.first_name || "";
  const lastName = ctx.from?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  if (ctx.session.userData?.contactInfo) {
    ctx.session.userData.contactInfo.name = fullName;
  }
  await ctx.editMessageText(`Ваше ім'я підтверджено як: ${fullName}.`);
  await ctx.scene.enter("phoneScene");
});

nameScene.action("edit_name", async (ctx) => {
  await ctx.editMessageText("Будь ласка, введіть ваше ім'я:");
});

nameScene.on(message("text"), async (ctx) => {
  const text = ctx.message.text;
  if (ctx.session.userData?.contactInfo) {
    ctx.session.userData.contactInfo.name = text;
  }
  await ctx.reply(`Дякую! Ваше ім'я: ${text}.`);
  await ctx.scene.enter("phoneScene");
});
