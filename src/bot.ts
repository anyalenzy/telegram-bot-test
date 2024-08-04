import { Telegraf } from "telegraf";
import {
  continueHandler,
  apartmentHandler,
  houseHandler,
  locationHandler,
  districtHandler,
  worksHandler,
  worksSelectedHandler,
  finishSelectionHandler,
} from "./handlers/actions";
import { startHandler } from "./handlers/commands";

const BOT_TOKEN = process.env.BOT_TOKEN;
console.log(BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("Bot token is required!");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => startHandler(ctx));

bot.action("continue", continueHandler);
bot.action("apartment", apartmentHandler);
bot.action("house", houseHandler);
bot.action(/(room|area)_(.+)/, locationHandler);
bot.action(/location.+/, districtHandler);
bot.action(/district.+/, worksHandler);
bot.action(/work.+/, worksSelectedHandler);
bot.action("finish_selection", finishSelectionHandler);

export default bot;
