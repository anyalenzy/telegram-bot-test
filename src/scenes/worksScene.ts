import { Scenes, Markup } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { MyContext } from "../bot";
import { Constants } from "../types";

export const worksScene = new Scenes.BaseScene<MyContext>("worksScene");

worksScene.enter((ctx) => {
  const works: Constants = {
    house: [
      ["Покрівля", "work_pokrivlya"],
      ["Вікна", "work_vikna"],
      ["Внутрішні роботи", "work_vnutrishniRoboty"],
      ["Електрика", "work_elektryka"],
      ["Сантехніка", "work_santekhnika"],
      ["Опалення", "work_opalennya"],
      ["Iнше", "work_other"],
    ],
    apartment: [
      ["Вікна", "work_vikna"],
      ["Двері", "work_dveri"],
      ["Внутрішні роботи", "work_vnutrishniRoboty"],
      ["Електрика", "work_elektryka"],
      ["Сантехніка", "work_santekhnika"],
      ["Опалення", "work_opalennya"],
      ["Iнше", "work_other"],
    ],
  };

  const workOptions = works[ctx.session.userData.objectType!];
  const rows = [];

  for (let i = 0; i < workOptions.length; i += 2) {
    rows.push(workOptions.slice(i, i + 2));
  }

  ctx.reply(
    `${ctx.session.userData.district} Які будівельні роботи потрібно виконати?`,
    Markup.inlineKeyboard([
      ...rows.map((row) =>
        row.map(([label, callbackData]) =>
          Markup.button.callback(label, callbackData)
        )
      ),
      [Markup.button.callback("Завершити вибір", "finish_selection")],
      [Markup.button.callback("Назад", "back")],
    ])
  );
});

worksScene.action(/work_.+/, (ctx) => {
  if (ctx.has(callbackQuery("data"))) {
    const selectedWork = ctx.callbackQuery.data;
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
  ctx.scene.enter("contactFormScene");
});

worksScene.action("back", (ctx) => {
  ctx.scene.enter("districtScene");
});
