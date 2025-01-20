//src/handlres/handlersmedia.ts

import TelegramBot from "node-telegram-bot-api";
import { MediaData, CallbackQueryOptions } from "../interfaces/interface";
import Client from "../auth/AuthClient";

export default class HandlersMedia {
  static async sendMediaDocument(
    chat_id: number,
    data_document: string[],
    data_media: MediaData[],
    message_id: number
  ): Promise<void> {
    if (data_document.length === 0) {
      return;
    }

    if (data_document.length >= 3) {
      let file_ids = data_document.splice(0, 3);
      let promises: Promise<TelegramBot.Message>[] = [];

      for (let item of file_ids) {
        promises.push(
          Client.sendDocument(chat_id, item, {
            reply_to_message_id: message_id,
          })
        );
      }

      try {
        await Promise.any(promises);

        const option: CallbackQueryOptions = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Lanjutkan Sisa: ${
                    data_document.length + data_media.length - 1
                  }`,
                  callback_data: "lanjutkan_document",
                },
              ],
            ],
          },
        };

        if (data_document.length === 1) {
          console.info(`Data Document sisa adalah ${data_document.length}`);
          await Client.sendDocument(chat_id, data_document[0], {
            reply_to_message_id: message_id,
          });
          return;
        } else {
          const sentMessage = await Client.sendMessage(
            chat_id,
            "Lanjutkan",
            option
          );
          Client.on("callback_query", async (event) => {
            if (event.data === "lanjutkan_document") {
              try {
                await Client.deleteMessage(chat_id, sentMessage.message_id);
                console.log(`Berhasil menghapus dari Pesan Document`);
                console.info(
                  `Callback dari Button Document di click sisa document adalah ${data_document.length}`
                );
                await this.sendMediaDocument(
                  chat_id,
                  data_document,
                  data_media,
                  message_id
                );
                console.info(`Mengirimkan Document selanjutnya....`);
              } catch (err) {
                console.error(err);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error sending documents:", error);
      }
    } else {
      // Handle cases where data_document.length is less than 3
      for (const doc of data_document) {
        await Client.sendDocument(chat_id, doc, {
          reply_to_message_id: message_id,
        });
      }
      data_document = []; // Clear the array after sending
    }
  }

  static async send_msg_Media(
    chat_id: number,
    data_media: MediaData[],
    data_document: string[],
    message_id: number
  ): Promise<void> {
    if (data_media.length === 0) {
      console.info(`Data Media Document Dijalankan`);
      await this.sendMediaDocument(
        chat_id,
        data_document,
        data_media,
        message_id
      );
      return;
    }

    if (data_media.length >= 4) {
      console.info(
        `Kondisi media lebih dari 4 Dijalankan sisa Media adalah ${data_media.length}`
      );
      const data_split = data_media.splice(0, 4);
      await Client.sendMediaGroup(chat_id, data_split, {
        reply_to_message_id: message_id,
      });

      const option: CallbackQueryOptions = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Lanjutkan Sisa: ${
                  data_document.length + data_media.length
                }`,
                callback_data: "lanjutkan_media",
              },
            ],
          ],
        },
      };

      const sentMessage = await Client.sendMessage(
        chat_id,
        "Click Message",
        option
      );
      Client.on("callback_query", async (event) => {
        if (event.data === "lanjutkan_media") {
          await Client.deleteMessage(chat_id, sentMessage.message_id);
          console.log(`Berhasil menghapus pesan dari Callback Media`);
          console.info(
            `Callback Button dari Media dijalankan sisa media adalah ${data_media.length}`
          );
          await this.send_msg_Media(
            chat_id,
            data_media,
            data_document,
            message_id
          );
        }
      });
    } else {
      await Client.sendMediaGroup(chat_id, data_media, {
        reply_to_message_id: message_id,
      });
      console.info(
        `Pengiriman media kurang dari dari 4 sisa media adalah ${data_media.length}`
      );
      data_media = []; // Clear the array
      await this.sendMediaDocument(
        chat_id,
        data_document,
        data_media,
        message_id
      );
    }
  }
}