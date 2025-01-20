//src/interfaces/index.ts

import HandlersMessage from "./handlers/HandlersMessage";

async function run() {
  await HandlersMessage.getMessage();
  console.log(`Bot Berhasil dijalankan`);
}

run();