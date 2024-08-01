import { Telegraf, Context, Markup } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
console.log(BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("Bot token is required!");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx: Context) => {
  ctx.reply(
    "Добрый день! Мы поможем вам быстро оформить заявку на строй работы по программе е-восстановление. Какой объект вам нужно восстановить?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Квартира", "apartment")],
      [Markup.button.callback("Дом", "house")],
    ])
  );
});

bot.action("apartment", (ctx: Context) => {
  ctx.answerCbQuery();
  ctx.editMessageText(
    "Вы выбрали квартиру. Выберите количество комнат:",
    Markup.inlineKeyboard([
      [Markup.button.callback("1 комната", "room_1")],
      [Markup.button.callback("2 комнаты", "room_2")],
      [Markup.button.callback("3 комнаты", "room_3")],
      [Markup.button.callback("4 комнаты", "room_4")],
    ])
  );
});

bot.action("house", (ctx: Context) => {
  ctx.answerCbQuery();
  ctx.editMessageText(
    "Вы выбрали дом. Выберите площадь дома:",
    Markup.inlineKeyboard([
      [Markup.button.callback("Менее 100м²", "area_less_100")],
      [Markup.button.callback("Более 100м²", "area_more_100")],
    ])
  );
});
bot.action(/(room|area)_(.+)/, (ctx: Context) => {
  ctx.answerCbQuery();
  askLocation(ctx);
});

function askLocation(ctx: Context) {
  ctx.reply(
    "Где находится объект?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Харьков", "location_kharkiv")],
      [Markup.button.callback("Харьковская область", "location_region")],
    ])
  );
}

bot.action("location_kharkiv", (ctx: Context) => {
  ctx.answerCbQuery();
  ctx.reply("Вы выбрали Харьков.");
});

bot.action("location_region", (ctx: Context) => {
  ctx.answerCbQuery();
  ctx.reply("Вы выбрали Харьковскую область.");
});

bot.help((ctx: Context) => ctx.reply("Send any message and I will repeat it."));

// bot.on("text", (ctx: Context) => {
//   ctx.reply("Привіт! Я отримав твоє повідомлення.");
// });

export default bot;
