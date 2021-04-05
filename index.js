const path = require("path");
var _ = require("lodash");
const axios = require("axios");
const DATA_DIR = "data";
require("dotenv").config({ path: path.resolve(__dirname, DATA_DIR + "/.env") });
const { computeFuturesOpenOrdersDeltaMessage } = require("./diff");

const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(DATA_DIR + "/db-binfutorderswatch.json");
const db = low(adapter);

db.defaults({ futuresOpenOrders: [] }).write();

(async function () {
  console.info("Fetching...");
  // https://github.com/binance-exchange/node-binance-api#binance-futures-api
  const foa = await binance.futuresOpenOrders();
  console.info("Received futuresOpenOrders:", foa);
  if (!foa) return;
  const previous = db.get("futuresOpenOrders", foa).value();
  db.set("futuresOpenOrders", foa).write();
  const messages = computeFuturesOpenOrdersDeltaMessage(previous, foa);
  console.log("messages", messages);

  if (messages) {
    console.log("Sending messages...");
    const promises = _.chunk(messages, 3).map(async (batch) => {
      axios.post("https://api.telegram.org/bot" + process.env.TELEGRAM_BOTTOKEN + "/sendMessage", {
        chat_id: process.env.TELEGRAM_CHATID,
        text: batch.join("\n"),
      });
    });
    await Promise.all(promises);
    console.log("Sending messages: done!");
  }
})();

console.log("Running");
