import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import bot from "./bot";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

bot
  .launch()
  .then(() => {
    console.log("Bot launched successfully");
  })
  .catch((error) => {
    console.error("Error launching bot:", error);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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
