import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext } from "../types";

export const addressScene = new Scenes.BaseScene<MyContext>("addressScene");

addressScene.enter(async (ctx) => {
  await ctx.reply("Будь ласка, введіть вашу адресу:");
});

addressScene.on(message("text"), async (ctx) => {
  const text = ctx.message.text;
  if (ctx.session.userData?.contactInfo) {
    ctx.session.userData.contactInfo.address = text;
    await ctx.scene.enter("editScene");
  }
});
