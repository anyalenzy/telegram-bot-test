import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "telegraf";
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
import { objectScene } from "./scenes/objectScene";
import { locationScene } from "./scenes/locationScene";
import { districtScene } from "./scenes/districtScene";
import { worksScene } from "./scenes/worksScene";

const BOT_TOKEN = process.env.BOT_TOKEN;
console.log(BOT_TOKEN);

if (!BOT_TOKEN) {
  throw new Error("Bot token is required!");
}

const bot = new Telegraf<MyContext>(BOT_TOKEN);

interface UserData {
  username?: string;
  objectType?: string;
  area?: string;
  location?: string;
  district?: string;
  works?: string[];
}

interface MySession extends Scenes.SceneSession {
  userData: UserData;
}
export interface MyContext extends Context {
  // свойство для пользовательских данных
  session: MySession;

  // свойство для сцены
  scene: Scenes.SceneContextScene<MyContext>;
}
// export interface MyContext extends Context, Scenes.SceneContext {
//   userData: UserData;
// }

const stage = new Scenes.Stage<MyContext>([
  objectScene,
  locationScene,
  districtScene,
  worksScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.session.userData = {};
  ctx.scene.enter("objectScene");
});

// bot.start((ctx) => startHandler(ctx));

// bot.action("continue", continueHandler);
// bot.action("apartment", apartmentHandler);
// bot.action("house", houseHandler);
// bot.action(/(room|area)_(.+)/, locationHandler);
// bot.action(/location.+/, districtHandler);
// bot.action(/district.+/, worksHandler);
// bot.action(/work.+/, worksSelectedHandler);
// bot.action("finish_selection", finishSelectionHandler);

export default bot;
