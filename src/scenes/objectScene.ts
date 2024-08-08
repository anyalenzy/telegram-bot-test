import { Scenes, Markup } from "telegraf";
import { MyContext } from "../bot";

export const objectScene = new Scenes.BaseScene<MyContext>("objectScene");

objectScene.enter((ctx) => {
  ctx.reply(
    "Який об'єкт вам потрібно відновити?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Квартира", "apartment")],
      [Markup.button.callback("Дім", "house")],
    ])
  );
});

objectScene.action("apartment", (ctx) => {
  ctx.session.userData.objectType = "apartment";
  ctx.scene.enter("locationScene");
});

objectScene.action("house", (ctx) => {
  ctx.session.userData.objectType = "house";
  ctx.scene.enter("locationScene");
});

// Обработка кнопки "Назад"
objectScene.action("back", (ctx) => {
  ctx.reply("Ви на початковому етапі. Немає куди повертатися.");
});
