// src/interfaces/interface.ts

import TelegramBot from "node-telegram-bot-api";

export type MediaData = TelegramBot.InputMedia & {
    media: string;
};

export interface CallbackQueryOptions {
    reply_markup: {
        inline_keyboard: InlineKeyboardButton[][];
    };
}

export interface InlineKeyboardButton {
    text: string;
    callback_data: string;
}