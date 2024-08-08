import { Scenes, Markup } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { MyContext } from "../bot";
import { Constants } from "../types";

export const districtScene = new Scenes.BaseScene<MyContext>("districtScene");

export const createInlineKeyboardRows = (
  buttons: [string, string][],
  buttonsPerRow: number
) => {
  const rows: [string, string][][] = [];
  for (let i = 0; i < buttons.length; i += buttonsPerRow) {
    rows.push(buttons.slice(i, i + buttonsPerRow));
  }
  return rows.map((row) =>
    row.map(([label, callbackData]) =>
      Markup.button.callback(label, callbackData)
    )
  );
};

districtScene.enter((ctx) => {
  const districts: Constants = {
    location_kharkiv: [
      ["Холодногірський", "district_holodnogirskiy"],
      ["Шевченківський", "district_shevchenkivskiy"],
      ["Київський", "district_kyivskiy"],
      ["Салтівський", "district_saltivskiy"],
      ["Немишлянський", "district_nemishlyanskiy"],
      ["Індустріальний", "district_industrial"],
      ["Слобідський", "district_slobidsky"],
      ["Основ'янський", "district_osnovyansky"],
      ["Новобаварський", "district_novobavarskiy"],
    ],
    location_region: [
      ["Богодухівський", "district_bogodukhivskiy"],
      ["Ізюмський", "district_izumskiy"],
      ["Красноградський", "district_krasnohradskiy"],
      ["Куп'янський", "district_kupyanskskiy"],
      ["Лозівський", "district_lozivskiy"],
      ["Харківський", "district_kharkivskiy"],
      ["Чугуївський", "district_chuguivskiy"],
    ],
  };

  const districtButtons = districts[ctx.session.userData.location!];
  if (districtButtons) {
    const rows = createInlineKeyboardRows(districtButtons, 2);
    rows.push([Markup.button.callback("Назад", "back")]);
    ctx.reply(
      `ви обрали ${ctx.session.userData.location} Оберіть район:`,
      Markup.inlineKeyboard(rows)
    );
  } else {
    ctx.reply("Не вдалося знайти райони для обраної локації.");
    ctx.scene.enter("locationScene");
  }
});

districtScene.action(/district_.+/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    ctx.session.userData.district = ctx.callbackQuery.data;
  }
  console.log(ctx.session.userData);
  ctx.scene.enter("worksScene");
});

districtScene.action("back", (ctx) => {
  ctx.scene.enter("locationScene");
});
