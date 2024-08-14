import { Scenes } from "telegraf";
import { createEditButtons, isValidPhoneNumber } from "../utils/helpers";
import { message, callbackQuery } from "telegraf/filters";
import { MyContext } from "../types";
import { getFirstPartByUnderscore } from "../utils/helpers";

export const editScene = new Scenes.BaseScene<MyContext>("editScene");

editScene.enter(async (ctx) => {
  try {
    const field = ctx.session?.userData?.editingField;
    if (ctx.session.userData?.contactInfo) {
      const { name, phone, address } = ctx.session.userData.contactInfo;
      if (!field) {
        await ctx.reply(
          `Ось ваші контактні дані:\nІм'я: ${name}\nТелефон: ${phone}\nАдреса: ${address}\n\nВи можете змінити будь-яке поле, або підтвердити дані.`,
          createEditButtons()
        );
      } else if (field === "name") {
        await ctx.editMessageText("Введіть своє нове ім'я:");
      } else if (field === "phone") {
        await ctx.editMessageText("Введіть новий номер телефону:");
      } else if (field === "address") {
        await ctx.editMessageText("Введіть нову адресу:");
      }
    }
  } catch (error) {
    console.error("Error in editScene.enter:", error);
  }
});

editScene.on(message("text"), async (ctx) => {
  try {
    const text = ctx.message.text;
    if (ctx.session?.userData) {
      const { editingField, contactInfo } = ctx.session.userData;
      if (contactInfo) {
        if (editingField === "name") {
          contactInfo.name = text;
          await ctx.reply(
            `Дякую! Ось ваші оновлені контактні дані:\nІм'я: ${contactInfo.name}\nТелефон: ${contactInfo.phone}\nАдреса: ${contactInfo.address}\n\nВи можете змінити будь-яке поле, або підтвердити дані.`,
            createEditButtons()
          );
        } else if (editingField === "phone") {
          if (isValidPhoneNumber(text)) {
            contactInfo.phone = text;
            await ctx.reply(
              `Дякую! Ось ваші оновлені контактні дані:\nІм'я: ${contactInfo.name}\nТелефон: ${contactInfo.phone}\nАдреса: ${contactInfo.address}\n\nВи можете змінити будь-яке поле, або підтвердити дані.`,
              createEditButtons()
            );
          } else {
            await ctx.reply(
              "Введено недійсний номер телефону. Будь ласка, спробуйте ще раз у форматі +380*********:"
            );
          }
        } else if (editingField === "address") {
          contactInfo.address = text;
          await ctx.reply(
            `Дякую! Ось ваші оновлені контактні дані:\nІм'я: ${contactInfo.name}\nТелефон: ${contactInfo.phone}\nАдреса: ${contactInfo.address}\n\nВи можете змінити будь-яке поле, або підтвердити дані.`,
            createEditButtons()
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in editScene.on:", error);
  }
});

editScene.action("confirm", async (ctx) => {
  try {
    delete ctx.session.userData.editingField;
    await ctx.scene.enter("confirmScene");
  } catch (error) {
    console.error("Error in editScene.on:", error);
  }
});

editScene.action(/.+_edit/, async (ctx) => {
  try {
    if (ctx.has(callbackQuery("data")) && ctx.session.userData) {
      const field = getFirstPartByUnderscore(ctx.callbackQuery.data);
      ctx.session.userData.editingField = field;
      await ctx.answerCbQuery();
      if (field) {
        await ctx.scene.reenter();
      }
    }
  } catch (error) {
    console.error("Error in editScene.on:", error);
  }
});
