import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { isValidPhoneNumber } from "../utils/helpers";
import { MyContext } from "../types";

export const phoneScene = new Scenes.BaseScene<MyContext>("phoneScene");

phoneScene.enter(async (ctx) => {
  await ctx.reply(
    "Дякую! Тепер поділіться своїм номером телефону або введіть його вручну:",
    Markup.keyboard([Markup.button.contactRequest("Надіслати номер телефону")])
      .oneTime()
      .resize()
  );
});

phoneScene.on(message("contact"), async (ctx) => {
  const contact = ctx.message?.contact?.phone_number;
  if (contact && ctx.session.userData?.contactInfo) {
    ctx.session.userData.contactInfo.phone = contact;
    await ctx.scene.enter("addressScene");
  }
});

phoneScene.on(message("text"), async (ctx) => {
  const text = ctx.message.text;

  if (isValidPhoneNumber(text) && ctx.session.userData?.contactInfo) {
    ctx.session.userData.contactInfo.phone = text;
    await ctx.scene.enter("addressScene");
  } else {
    await ctx.reply(
      "Введено недійсний номер телефону. Будь ласка, спробуйте ще раз у форматі +380*********:"
    );
  }
});
