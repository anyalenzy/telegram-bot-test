import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import bot from "./bot";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const webhookDomain = process.env.WEBHOOK_DOMAIN;
const webhookPath = `/webhook/${process.env.BOT_TOKEN}`;
const webhookUrl = `${webhookDomain}${webhookPath}`;

bot.telegram
  .setWebhook(webhookUrl)
  .then(() => {
    console.log("Webhook set successfully");
  })
  .catch((error) => {
    console.error("Error setting webhook:", error);
  });

app.use(bot.webhookCallback(webhookPath));
console.log("Webhook URL:", webhookUrl);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  const message = error.message || "Server error";
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
