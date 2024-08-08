import { Scenes, Markup } from "telegraf";
import { MyContext } from "../types";
import { callbackQuery } from "telegraf/filters";
import { getFirstPartByUnderscore } from "../utils/helpers";

export const objectScene = new Scenes.BaseScene<MyContext>("objectScene");

objectScene.enter((ctx) => {
  ctx.session.userData = {
    id: ctx.from?.id || 0,
    username: ctx.from?.username || "",
    objectType: "",
    area: "",
    location: "",
    district: "",
    works: [],
  };
  ctx.reply(
    "Який об'єкт вам потрібно відновити?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Квартира", "квартира_objectType")],
      [Markup.button.callback("Дім", "дім_objectType")],
    ])
  );
});

objectScene.action(/.+_objectType/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.session.userData.objectType = getFirstPartByUnderscore(
      ctx.callbackQuery.data
    );
  }
  ctx.scene.enter("areaScene");
});
