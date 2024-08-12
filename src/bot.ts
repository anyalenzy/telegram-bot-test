import { Telegraf, Scenes, session } from "telegraf";
import { startHandler } from "./handlers/startHandler";
import { continueHandler } from "./handlers/continueHandler";
import { objectScene } from "./scenes/objectScene";
import { locationScene } from "./scenes/locationScene";
import { districtScene } from "./scenes/districtScene";
import { worksScene } from "./scenes/worksScene";
import { areaScene } from "./scenes/areaScene";
import { contactFormScene } from "./scenes/contactFormScene";
import { nameScene } from "./scenes/nameScene";
import { phoneScene } from "./scenes/phoneScene";
import { addressScene } from "./scenes/addressScene";
import { confirmScene } from "./scenes/confirmScene";
import { editScene } from "./scenes/editScene";
import { MyContext } from "./types";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("Bot token is required!");
}

const bot = new Telegraf<MyContext>(BOT_TOKEN);

const stage = new Scenes.Stage<MyContext>([
  objectScene,
  locationScene,
  districtScene,
  worksScene,
  areaScene,
  contactFormScene,
  nameScene,
  phoneScene,
  addressScene,
  confirmScene,
  editScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => startHandler(ctx));

bot.action("continue", continueHandler);

export default bot;
