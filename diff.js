const { add } = require("lodash");
var _ = require("lodash");

exports.diffFuturesOpenOrders = function (previous, current) {
  // [] => qqch
  // qqch -> []
  // [a]=>[b]
  // [a]=>[a]
  if (_.isEmpty(previous) && _.isEmpty(current)) return [false, "Still no order."];
  if (_.isEmpty(previous) && !_.isEmpty(current)) return [true, "From no order to new order(s): " + JSON.stringify(current)];
  if (!_.isEmpty(previous) && _.isEmpty(current)) return [true, "All orders were removed - orders were: " + JSON.stringify(previous)];

  // both array are not empty
  previous = previous.map((o) => ({ ...o, updateTime: 0 }));
  current = current.map((o) => ({ ...o, updateTime: 0 }));
  const added = difference(current, previous);
  const removed = difference(previous, current);

  if (_.isEmpty(removed) && _.isEmpty(added)) return [false, "No change on current order(s): " + JSON.stringify(current)];
  return [true, "Orders changed. Removed: " + JSON.stringify(removed) + ",\n Added: " + JSON.stringify(added)];
};

/**
 * https://gist.github.com/Yimiprod/7ee176597fef230d1451
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
