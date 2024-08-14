import { Scenes } from "telegraf";
import { MyContext } from "../types";

export const confirmScene = new Scenes.BaseScene<MyContext>("confirmScene");

const recipientIds = process.env.RECIPIENT_IDS?.split(",").map((id) =>
  parseInt(id.trim(), 10)
);

confirmScene.enter(async (ctx) => {
  if (ctx.session.userData?.contactInfo && ctx.session.userData?.works) {
    const messageText = `
📋 <b>Дані замовлення:</b>

🏠 <b>Об'єкт:</b> ${ctx.session.userData.objectType}
📍 <b>Розташування:</b> ${ctx.session.userData.location}, ${
      ctx.session.userData.district
    } район
📏 <b>Обрана площа:</b> ${ctx.session.userData.area}

🔨 <b>Необхідні роботи:</b>
- ${ctx.session.userData.works.join("\n- ")}

📞 <b>Контактна інформація:</b>
- <b>Ім'я:</b> ${ctx.session.userData.contactInfo.name}
- <b>Телефон:</b> ${ctx.session.userData.contactInfo.phone}
- <b>Адреса:</b> ${ctx.session.userData.contactInfo.address}
`;
    if (
      recipientIds &&
      Array.isArray(recipientIds) &&
      recipientIds.length > 0
    ) {
      const results = await Promise.allSettled(
        recipientIds.map((userId) =>
          ctx.telegram
            .sendMessage(userId, messageText, {
              parse_mode: "HTML",
            })
            .then(() => ({ status: "fulfilled", userId }))
            .catch((error) => ({ status: "rejected", userId, error }))
        )
      );

      results.forEach((result) => {
        if (result.status === "rejected") {
          const { userId, error } = result.reason as {
            userId: number;
            error: Error;
          };
          console.error(
            `Error when sending message to user with ID: ${userId}:`,
            error
          );
        }
      });
    } else {
      console.error(
        "The RECIPIENT_IDS environment variable is not set or empty"
      );
    }
    try {
      const confirmationMessage = `
${messageText}

Дякуємо за надану інформацію. Ми зв'яжемося з вами найближчим часом.
`;
      await ctx.editMessageText(confirmationMessage, {
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error("Error when editing the message for the user:", error);
    }
    try {
      await ctx.answerCbQuery();
      ctx.scene.leave();
    } catch (error) {
      console.error("Error in confirmScene.enter:", error);
    }
  } else {
    console.error("User data is incomplete or missing in the session.");
  }
});
