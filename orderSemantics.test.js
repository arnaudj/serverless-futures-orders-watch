const { orderLabel } = require("./orderSemantics");

const ethBuyOrder1 = {
  orderId: "1",
  symbol: "ETHUSDT",
  status: "NEW",
  clientOrderId: "x-f1",
  price: "1.1",
  avgPrice: "0.00000",
  origQty: "0.1",
  executedQty: "0",
  cumQuote: "0",
  timeInForce: "GTC",
  type: "LIMIT",
  reduceOnly: false,
  closePosition: false,
  side: "BUY",
  positionSide: "BOTH",
  stopPrice: "0",
  workingType: "CONTRACT_PRICE",
  priceProtect: false,
  origType: "LIMIT",
  time: 1, // order creation date
  updateTime: 2, // order 'last seen' date (usually few min max since this fetch open orders call)
};

test("Test semantics", () => {
  expect(orderLabel(ethBuyOrder1)).toEqual("'limit buy ETHUSDT price=1.1 qty=0.1 orderId=1 date=01/01/1970, 01:00:00'");
});
