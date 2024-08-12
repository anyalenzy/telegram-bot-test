import { Scenes, Markup } from "telegraf";
import { MyContext } from "../types";
import { callbackQuery } from "telegraf/filters";
import { getFirstPartByUnderscore } from "../utils/helpers";

export const locationScene = new Scenes.BaseScene<MyContext>("locationScene");

locationScene.enter((ctx) => {
  ctx.editMessageText(
    `Обрана площа: ${ctx.session.userData.area}. Де знаходиться об'єкт?`,
    Markup.inlineKeyboard([
      [Markup.button.callback("Харків", "Харків_location")],
      [
        Markup.button.callback(
          "Харківська область",
          "Харківська область_location"
        ),
      ],
      [Markup.button.callback("<< Назад", "back")],
    ])
  );
});

locationScene.action(/.+_location/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.session.userData.location = getFirstPartByUnderscore(
      ctx.callbackQuery.data
    );
  }
  ctx.scene.enter("districtScene");
});

locationScene.action("back", (ctx) => {
  ctx.scene.enter("areaScene");
});
