import { Context, Markup } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { UserData, Constants } from "../types";

const userData: UserData = {};

// Обробка дії "continue"
export const continueHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId) {
    userData[userId] = {
      ...(userData[userId] || {}),
      username: ctx.from.username,
    };
  }
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "Який об'єкт вам потрібно відновити?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Квартира", "apartment")],
      [Markup.button.callback("Дім", "house")],
    ])
  );
};

// Обробка дії "apartment"
export const apartmentHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId) {
    userData[userId] = {
      ...(userData[userId] || {}),
      objectType: "apartment",
    };
  }
  await ctx.editMessageText(
    "Ви обрали квартиру. Оберіть кількість кімнат:",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("1 кімната", "room_1"),
        Markup.button.callback("2 кімнати", "room_2"),
      ],
      [
        Markup.button.callback("3 кімнати", "room_3"),
        Markup.button.callback("4 кімнати", "room_4"),
      ],
    ])
  );
};

// Обробка дії "house"
export const houseHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId) {
    userData[userId] = {
      ...(userData[userId] || {}),
      objectType: "house",
    };
  }
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "Ви обрали дім. Оберіть площу дому:",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Менше 100м²", "area_less_100"),
        Markup.button.callback("Більше 100м²", "area_more_100"),
      ],
    ])
  );
};

// Обробка вибору розташування
export const locationHandler = async (ctx: Context) => {
  if (ctx.has(callbackQuery("data"))) {
    const userId = ctx.from?.id;
    if (userId) {
      userData[userId] = {
        ...(userData[userId] || {}),
        area: ctx.callbackQuery.data,
      };
    }
  }
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "Де знаходиться об'єкт?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Харків", "location_kharkiv")],
      [Markup.button.callback("Харківська область", "location_region")],
    ])
  );
};

// Обробка вибору району
export const districtHandler = async (ctx: Context) => {
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

  if (ctx.has(callbackQuery("data"))) {
    const userId = ctx.from?.id;
    if (userId) {
      userData[userId] = {
        ...(userData[userId] || {}),
        location: ctx.callbackQuery.data,
      };
      const locationName =
        userData[userId].location === "location_kharkiv"
          ? "Харків"
          : "Харківська область";
      const districtButtons = districts[userData[userId].location!];
      if (districtButtons) {
        const rows = [];
        for (let i = 0; i < districtButtons.length; i += 2) {
          rows.push(districtButtons.slice(i, i + 2));
        }

        await ctx.editMessageText(
          `Ви обрали ${locationName}. Оберіть район:`,
          Markup.inlineKeyboard(
            rows.map((row) =>
              row.map(([label, callbackData]) =>
                Markup.button.callback(label, callbackData)
              )
            )
          )
        );
      } else {
        await ctx.reply("Не вдалося знайти райони для обраної локації.");
      }
    }
  }
};

// Обробка вибору будівельних робіт
export const worksHandler = async (ctx: Context) => {
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
  if (ctx.has(callbackQuery("data"))) {
    const userId = ctx.from?.id;
    if (userId) {
      userData[userId] = {
        ...(userData[userId] || {}),
        district: ctx.callbackQuery.data,
      };
    }
    console.log(userData);
    const objectType = userData[userId].objectType;

    const workOptions = works[objectType as keyof Constants] || [];
    const rows = [];

    for (let i = 0; i < workOptions.length; i += 2) {
      rows.push(workOptions.slice(i, i + 2));
    }

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      "Які будівельні роботи потрібно виконати?",
      Markup.inlineKeyboard([
        ...rows.map((row) =>
          row.map(([label, callbackData]) =>
            Markup.button.callback(label, callbackData)
          )
        ),
        [Markup.button.callback("Завершити вибір", "finish_selection")],
      ])
    );
  }
};

export const worksSelectedHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId && ctx.has(callbackQuery("data"))) {
    const selectedWork = ctx.callbackQuery.data;

    if (!userData[userId]) {
      userData[userId] = {
        works: [],
      };
    }

    const userWorks = userData[userId].works || [];

    const isWorkExists = userWorks.includes(selectedWork);
    if (!isWorkExists) {
      userWorks.push(selectedWork);
    }

    userData[userId] = {
      ...(userData[userId] || {}),
      works: userWorks,
    };

    console.log(userData);
    await ctx.answerCbQuery();
  }
};

export const finishSelectionHandler = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId) {
    const selectedWorks = userData[userId]?.works || [];
    const selectedWorksText = selectedWorks.length
      ? `Ви зробили свій вибір. Заповніть наступну контактну форму, щоб ми могли зв'язатися з Вами.`
      : "Ви не обрали жодних робіт.";

    await ctx.reply(selectedWorksText);

    // Перехід до наступного кроку або завершення процесу
    // Наприклад, ви можете надіслати нове повідомлення чи питання
  }

  await ctx.answerCbQuery();
};
