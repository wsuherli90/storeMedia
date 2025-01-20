//.src/auth/AuthClient.ts

import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  console.error("TOKEN is not defined in .env file");
  process.exit(1); 
}

const Client = new TelegramBot(TOKEN, { polling: true });

export default Client;