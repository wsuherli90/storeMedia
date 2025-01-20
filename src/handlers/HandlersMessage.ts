//src/handlres/handlersmessages.ts


import { MediaData } from "../interfaces/interface";
import Client from "../auth/AuthClient";
import HandlersMedia from "./HandlersMedia";

export default class HandlersMessage {
  static async getMessage(): Promise<void> {
    Client.on("message", async (event) => {
      const chat_id = event.chat.id;
      const message_id = event.message_id;

      if (event.photo) {
        const file_id = event.photo[0].file_id;
        await Client.sendMessage(
          chat_id,
          `<b>Kode</b>: <code>p_${file_id}</code>`,
          { parse_mode: "HTML", reply_to_message_id: message_id }
        );
      } else if (event.video) {
        const file_id = event.video.file_id;
        await Client.sendMessage(
          chat_id,
          `<b>Kode</b>: <code>v_${file_id}</code>`,
          { parse_mode: "HTML", reply_to_message_id: message_id }
        );
      } else if (event.document) {
        const file_id = event.document.file_id;
        await Client.sendMessage(
          chat_id,
          `<b>Kode</b>: <code>d_${file_id}</code>`,
          { parse_mode: "HTML", reply_to_message_id: message_id }
        );
      } else if (event.text) {
        const code = event.text;
        const regex = /(p_|v_|d_)\S*/g;
        const results = code.match(regex);
        let data_media: MediaData[] = [];
        let data_document: string[] = [];

        if (results) {
          console.info("Mendapatkan Event Media");
          for (const items of results) {
            if (items.startsWith("v_")) {
              const msg_data: MediaData = {
                media: items.slice(2),
                type: "video",
              };
              data_media.push(msg_data);
            } else if (items.startsWith("p_")) {
              const msg_data: MediaData = {
                media: items.slice(2),
                type: "photo",
              };
              data_media.push(msg_data);
            } else if (items.startsWith("d_")) {
              data_document.push(items.slice(2));
            }
          }

          await HandlersMedia.send_msg_Media(
            chat_id,
            data_media,
            data_document,
            message_id
          );
        }
      }
    });
  }
}