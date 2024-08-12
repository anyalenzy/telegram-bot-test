import { Scenes } from "telegraf";
import { createEditButtons } from "../utils/helpers";
import { callbackQuery } from "telegraf/filters";
import { MyContext } from "../types";
import { getFirstPartByUnderscore } from "../utils/helpers";

export const confirmScene = new Scenes.BaseScene<MyContext>("confirmScene");

confirmScene.enter(async (ctx) => {
  if (ctx.session.userData?.contactInfo) {
    const { name, phone, address } = ctx.session.userData.contactInfo;
    await ctx.reply(
      `Ось ваші контактні дані:\nІм'я: ${name}\nТелефон: ${phone}\nАдреса: ${address}\n\nВи можете змінити будь-яке поле, або підтвердити дані.`,
      createEditButtons()
    );
  }
});

confirmScene.action("confirm", async (ctx) => {
  delete ctx.session.userData.editingField;
  console.log(ctx.session.userData);
  await ctx.reply(
    "Дякую за підтвердження! Ми зв'яжемося з вами найближчим часом."
  );
  ctx.scene.leave();
});

confirmScene.action(/.+_edit/, async (ctx) => {
  if (ctx.has(callbackQuery("data")) && ctx.session.userData) {
    const field = getFirstPartByUnderscore(ctx.callbackQuery.data);
    ctx.session.userData.editingField = field;
    if (field) {
      await ctx.scene.enter("editScene");
    }
  }
});
