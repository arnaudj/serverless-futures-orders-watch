require("dotenv").config();

const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

(async function () {
  const foa = await binance.futuresOpenOrders();
  console.info(foa);
})();

console.log("...");
