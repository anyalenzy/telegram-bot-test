import { Scenes, Markup } from "telegraf";
import { MyContext } from "../bot";
import { callbackQuery } from "telegraf/filters";

export const locationScene = new Scenes.BaseScene<MyContext>("locationScene");

locationScene.enter((ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.reply(
      `${ctx.session.userData.objectType} знаходиться об'єкт?`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Харків", "location_kharkiv")],
        [Markup.button.callback("Харківська область", "location_region")],
        [Markup.button.callback("Назад", "back")],
      ])
    );
    console.log(ctx.session.userData);
  }
});

locationScene.action("location_kharkiv", (ctx) => {
  ctx.session.userData.location = "location_kharkiv";
  ctx.scene.enter("districtScene");
});

locationScene.action("location_region", (ctx) => {
  ctx.session.userData.location = "location_region";
  ctx.scene.enter("districtScene");
});

locationScene.action("back", (ctx) => {
  ctx.scene.enter("objectScene");
});
