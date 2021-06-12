var _ = require("lodash");
var { orderLabel } = require("./orderSemantics");

const computeFuturesOpenOrdersDeltaMessage = function (previous, current) {
  return computeFuturesOpenOrdersDeltaEvents(previous, current).map(
    (event) => `${_.capitalize(event.type)} ${orderLabel(event.order)}`
  );
};

const computeFuturesOpenOrdersDeltaEvents = function (previous, current) {
  const { added, removed } = diffFuturesOpenOrders(previous, current);
  const addEvents = added.map((order) => ({ type: "add", order }));
  const removeEvents = removed.map((order) => ({ type: "remove", order }));
  return [...removeEvents, ...addEvents];
};

/**
 * @param {Array<Order>} previous
 * @param {Array<Order>} current
 * @returns Array<{removed:Array<Order>, added:Array<Order>}>
 */
const diffFuturesOpenOrders = function (previous, current) {
  if (_.isEmpty(previous) && _.isEmpty(current)) return { removed: [], added: [] };
  if (_.isEmpty(previous) && !_.isEmpty(current)) return { removed: [], added: current };
  if (!_.isEmpty(previous) && _.isEmpty(current)) return { removed: previous, added: [] };

  const buildOrderKey = (order) => order.clientOrderId || order.orderId;
  return diffArraysByKey(previous, current, buildOrderKey);
};

/**
 *
 * @param {Array} previous
 * @param {Array} current
 * @param {Function} buildUniqueKey
 * @returns
 */
function diffArraysByKey(previous, current, buildUniqueKey) {
  const buildMap = (source, hashFunc) => new Map(source.map((order) => [hashFunc(order), order]));
  const prev = buildMap(previous, buildUniqueKey);
  const curr = buildMap(current, buildUniqueKey);

  const diff = (arrayA, arrayB) => {
    const store = [];
    arrayA.forEach((value, k) => {
      if (!arrayB.has(k)) store.push(value);
    });
    return store;
  };

  const removed = diff(prev, curr);
  const added = diff(curr, prev);
  return { removed, added };
}

module.exports = {
  diffFuturesOpenOrders,
  computeFuturesOpenOrdersDeltaEvents,
  computeFuturesOpenOrdersDeltaMessage,
};
