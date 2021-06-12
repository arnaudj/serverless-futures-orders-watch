var _ = require("lodash");
const axios = require("axios");
const Binance = require("node-binance-api");
const { computeFuturesOpenOrdersDeltaMessage } = require("./diff");

async function run(dbProvider, env) {
  console.info("Fetching...");
  const binance = new Binance().options({
    APIKEY: env.APIKEY,
    APISECRET: env.APISECRET,
  });
  const foa = await binance.futuresOpenOrders(); // https://github.com/binance-exchange/node-binance-api#binance-futures-api
  console.info("Received futuresOpenOrders:", foa);
  if (!foa) return;
  const previous = await dbProvider.loadDB("futuresOpenOrders");
  console.info("Persisted: ", previous);
  const messages = computeFuturesOpenOrdersDeltaMessage(previous, foa);
  console.log("messages: ", messages);

  if (!_.isEmpty(messages)) {
    console.log("Saving update...");
    await dbProvider.saveDB("futuresOpenOrders", foa);
    console.log("Sending messages...");
    const promises = _.chunk(messages, 3).map(async (batch) => {
      axios.post("https://api.telegram.org/bot" + env.TELEGRAM_BOTTOKEN + "/sendMessage", {
        chat_id: env.TELEGRAM_CHATID,
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
