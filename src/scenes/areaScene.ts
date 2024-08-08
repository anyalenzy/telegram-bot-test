import { Scenes, Markup } from "telegraf";
import { MyContext } from "../types";
import { callbackQuery } from "telegraf/filters";
import { getFirstPartByUnderscore } from "../utils/helpers";

export const areaScene = new Scenes.BaseScene<MyContext>("areaScene");

areaScene.enter(async (ctx) => {
  if (ctx.session.userData.objectType === "квартира") {
    await ctx.editMessageText(
      "Ви обрали квартиру. Оберіть кількість кімнат:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("1 кімната", "1 кімната_area"),
          Markup.button.callback("2 кімнати", "2 кімнати_area"),
        ],
        [
          Markup.button.callback("3 кімнати", "3 кімнати_area"),
          Markup.button.callback("4 кімнати", "4 кімнати_area"),
        ],
        [Markup.button.callback("Назад", "back")],
      ])
    );
  } else if (ctx.session.userData.objectType === "дім") {
    await ctx.editMessageText(
      "Ви обрали дім. Оберіть площу дому:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Менше 100м²", "менше 100м²_area"),
          Markup.button.callback("Більше 100м²", "більше 100м²_area"),
        ],
        [Markup.button.callback("Назад", "back")],
      ])
    );
  }
});

areaScene.action(/.+_area/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.session.userData.area = getFirstPartByUnderscore(
      ctx.callbackQuery.data
    );
  }
  ctx.scene.enter("locationScene");
});

areaScene.action("back", (ctx) => {
  ctx.scene.enter("objectScene");
});
