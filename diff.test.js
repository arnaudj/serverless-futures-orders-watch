const {
  diffFuturesOpenOrders,
  computeFuturesOpenOrdersDeltaEvents,
  computeFuturesOpenOrdersDeltaMessage,
} = require("./diff");

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
};

const ethBuyOrder1PriceIncreased = {
  ...ethBuyOrder1,
  orderId: "2",
  clientOrderId: "x-f2",
  price: "1.2",
};

describe("Test array diff", () => {
  describe("with no change", () => {
    test("with empty persistence", () => {
      expect(diffFuturesOpenOrders(undefined, undefined)).toEqual({ removed: [], added: [] });
      expect(diffFuturesOpenOrders([], [])).toEqual({ removed: [], added: [] });
    });

    test("with 1 persisted order", () => {
      expect(diffFuturesOpenOrders([ethBuyOrder1], [ethBuyOrder1])).toEqual({ removed: [], added: [] });
    });

    test("with N persisted orders", () => {
      expect(
        diffFuturesOpenOrders([ethBuyOrder1, ethBuyOrder1PriceIncreased], [ethBuyOrder1, ethBuyOrder1PriceIncreased])
      ).toEqual({ removed: [], added: [] });
      expect(
        diffFuturesOpenOrders([ethBuyOrder1PriceIncreased, ethBuyOrder1], [ethBuyOrder1, ethBuyOrder1PriceIncreased])
      ).toEqual({ removed: [], added: [] });
      expect(
        diffFuturesOpenOrders([ethBuyOrder1PriceIncreased, ethBuyOrder1], [ethBuyOrder1PriceIncreased, ethBuyOrder1])
      ).toEqual({ removed: [], added: [] });
    });
  });

  test("with 1 order removed", () => {
    expect(diffFuturesOpenOrders([ethBuyOrder1], [])).toEqual({ removed: [ethBuyOrder1], added: [] });
  });

  test("with 1 order added", () => {
    expect(diffFuturesOpenOrders([], [ethBuyOrder1])).toEqual({ removed: [], added: [ethBuyOrder1] });
  });

  test("with 1 order changed", () => {
    expect(diffFuturesOpenOrders([ethBuyOrder1], [ethBuyOrder1PriceIncreased])).toEqual({
      removed: [ethBuyOrder1],
      added: [ethBuyOrder1PriceIncreased],
    });
  });
});

describe("Test diff events generation", () => {
  describe("with no change", () => {
    test("with empty persistence", () => {
      expect(computeFuturesOpenOrdersDeltaMessage(undefined, undefined)).toEqual([]);
      expect(computeFuturesOpenOrdersDeltaMessage([], [])).toEqual([]);
    });

    test("with 1 persisted order", () => {
      expect(computeFuturesOpenOrdersDeltaMessage([ethBuyOrder1], [ethBuyOrder1])).toEqual([]);
    });

    test("with N persisted orders", () => {
      expect(
        computeFuturesOpenOrdersDeltaMessage(
          [ethBuyOrder1, ethBuyOrder1PriceIncreased],
          [ethBuyOrder1, ethBuyOrder1PriceIncreased]
        )
      ).toEqual([]);
    });
  });

  test("with 1 order removed", () => {
    expect(computeFuturesOpenOrdersDeltaMessage([ethBuyOrder1], [])).toEqual([
      "Remove 'limit buy ETHUSDT price=1.1 qty=0.1 orderId=1'",
    ]);
  });

  test("with 1 order added", () => {
    expect(computeFuturesOpenOrdersDeltaMessage([], [ethBuyOrder1])).toEqual([
      "Add 'limit buy ETHUSDT price=1.1 qty=0.1 orderId=1'",
    ]);
  });

  test("with 1 order changed", () => {
    expect(computeFuturesOpenOrdersDeltaMessage([ethBuyOrder1], [ethBuyOrder1PriceIncreased])).toEqual([
      "Remove 'limit buy ETHUSDT price=1.1 qty=0.1 orderId=1'",
      "Add 'limit buy ETHUSDT price=1.2 qty=0.1 orderId=2'",
    ]);
  });
});

describe("Test diff message generation", () => {
  test("with 1 order removed", () => {
    expect(computeFuturesOpenOrdersDeltaEvents([ethBuyOrder1], [])).toEqual([{ type: "remove", order: ethBuyOrder1 }]);
  });

  test("with 1 order added", () => {
    expect(computeFuturesOpenOrdersDeltaEvents([], [ethBuyOrder1])).toEqual([{ type: "add", order: ethBuyOrder1 }]);
  });

  test("with 1 order changed", () => {
    expect(computeFuturesOpenOrdersDeltaEvents([ethBuyOrder1], [ethBuyOrder1PriceIncreased])).toEqual([
      { type: "remove", order: ethBuyOrder1 },
      { type: "add", order: ethBuyOrder1PriceIncreased },
    ]);
  });
});
