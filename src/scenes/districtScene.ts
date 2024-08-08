import { Scenes, Markup } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import {
  createInlineKeyboardRows,
  getFirstPartByUnderscore,
} from "../utils/helpers";
import { MyContext } from "../types";

export const districtScene = new Scenes.BaseScene<MyContext>("districtScene");

districtScene.enter((ctx) => {
  const districts: { [key: string]: [string, string][] } = {
    Харків: [
      ["Холодногірський", "Холодногірський_district"],
      ["Шевченківський", "Шевченківський_district"],
      ["Київський", "Київський_district"],
      ["Салтівський", "Салтівський_district"],
      ["Немишлянський", "Немишлянський_district"],
      ["Індустріальний", "Індустріальний_district"],
      ["Слобідський", "Слобідський_district"],
      ["Основ'янський", "Основ'янський_district"],
      ["Новобаварський", "Новобаварський_district"],
    ],
    "Харківська область": [
      ["Богодухівський", "Богодухівський_district"],
      ["Ізюмський", "Ізюмський_district"],
      ["Красноградський", "Красноградський_district"],
      ["Куп'янський", "Куп'янський_district"],
      ["Лозівський", "Лозівський_district"],
      ["Харківський", "Харківський_district"],
      ["Чугуївський", "Чугуївський_district"],
    ],
  };

  const districtButtons = districts[ctx.session.userData.location!];
  if (districtButtons) {
    const rows = createInlineKeyboardRows(districtButtons, 2);
    rows.push([Markup.button.callback("Назад", "back")]);
    ctx.reply(
      `Ви обрали ${ctx.session.userData.location}. Оберіть район:`,
      Markup.inlineKeyboard(rows)
    );
  } else {
    ctx.reply("Не вдалося знайти райони для обраної локації.");
    ctx.scene.enter("locationScene");
  }
});

districtScene.action(/.+_district/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.session.userData.district = getFirstPartByUnderscore(
      ctx.callbackQuery.data
    );
  }
  console.log(ctx.session.userData);
  ctx.scene.enter("worksScene");
});

districtScene.action("back", (ctx) => {
  ctx.scene.enter("locationScene");
});
