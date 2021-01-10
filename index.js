const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("../db-binfutorderswatch.json");
const db = low(adapter);

db.defaults({ futuresOpenOrders: [] }).write();

const { diffFuturesOpenOrders } = require("./diff");

(async function () {
  // https://github.com/binance-exchange/node-binance-api#binance-futures-api
  const foa = await binance.futuresOpenOrders();
  console.info("Received futuresOpenOrders:", foa);
  if (!foa) return;
  const previous = db.get("futuresOpenOrders", foa).value();
  db.set("futuresOpenOrders", foa).write();
  const differences = diffFuturesOpenOrders(previous, foa);
  console.log("differences", differences);
})();

console.log("...");
