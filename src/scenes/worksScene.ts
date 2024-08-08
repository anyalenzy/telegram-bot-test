import { Scenes, Markup } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { MyContext } from "../types";
import {
  createInlineKeyboardRows,
  getFirstPartByUnderscore,
} from "../utils/helpers";

export const worksScene = new Scenes.BaseScene<MyContext>("worksScene");

worksScene.enter((ctx) => {
  const works: { [key: string]: [string, string][] } = {
    дім: [
      ["Покрівля", "покрівля_work"],
      ["Вікна", "вікна_work"],
      ["Внутрішні роботи", "внутрішні роботи_work"],
      ["Електрика", "електрика_work"],
      ["Сантехніка", "сантехніка_work"],
      ["Опалення", "опалення_work"],
      ["Інше", "інше_work"],
    ],
    квартира: [
      ["Вікна", "вікна_work"],
      ["Двері", "двері_work"],
      ["Внутрішні роботи", "внутрішні роботи_work"],
      ["Електрика", "електрика_work"],
      ["Сантехніка", "сантехніка_work"],
      ["Опалення", "опалення_work"],
      ["Інше", "інше_work"],
    ],
  };

  const workButtons = works[ctx.session.userData.objectType!];
  const rows = createInlineKeyboardRows(workButtons, 2);
  rows.push(
    [Markup.button.callback("Назад", "back")],
    [Markup.button.callback("Завершити вибір", "finish_selection")]
  );
  ctx.reply(
    `Ви обрали${ctx.session.userData.district} район. Які будівельні роботи потрібно виконати?`,
    Markup.inlineKeyboard(rows)
  );
});

worksScene.action(/.+_work/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    const selectedWork = getFirstPartByUnderscore(ctx.callbackQuery.data);
    if (!ctx.session.userData.works) {
      ctx.session.userData.works = [];
    }
    const isWorkExists = ctx.session.userData.works.includes(selectedWork);
    if (!isWorkExists) {
      ctx.session.userData.works.push(selectedWork);
    }
  }
  ctx.answerCbQuery();
});

worksScene.action("finish_selection", (ctx) => {
  if (ctx.session.userData.works?.length) {
    ctx.scene.enter("contactFormScene");
  } else {
    ctx.editMessageText("Ви не обрали жодних робіт. Зробіть свій вибір");
    ctx.scene.enter("workScene");
  }
});

worksScene.action("back", (ctx) => {
  ctx.scene.enter("districtScene");
});
