import { MyContext } from "../types";

export const continueHandler = (ctx: MyContext) => {
  ctx.answerCbQuery();
  ctx.scene.enter("objectScene");
};
