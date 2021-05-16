var _ = require("lodash");
const axios = require("axios");
const { computeFuturesOpenOrdersDeltaMessage } = require("./diff");

async function run(dbProvider, env) {
  console.info("Fetching...");
  const Binance = require("node-binance-api");
  const binance = new Binance().options({
    APIKEY: env.APIKEY,
    APISECRET: env.APISECRET,
  });

  // https://github.com/binance-exchange/node-binance-api#binance-futures-api
  const foa = await binance.futuresOpenOrders();
  console.info("Received futuresOpenOrders:", foa);
  if (!foa) return;
  const previous = dbProvider.loadDB("futuresOpenOrders");
  dbProvider.saveDB("futuresOpenOrders", foa);
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
}

module.exports = {
  run,
};
