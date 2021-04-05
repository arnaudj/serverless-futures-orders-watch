const outputTimeZone = "europe/paris";

/**
 * @param {Order} o
 * @returns {string} label
 */
const orderLabel = (o) => {
  const keyval = (key, value) => `${key}=${value}`;
  const nonzeroField = (order, field) => (!!order[field] ? ` ${keyval(field, order[field])}` : "");
  const lowercaseFieldValue = (order, field) => (order[field] ? `${order[field].toLowerCase()} ` : "");
  let ret = "'";
  ret += lowercaseFieldValue(o, "type") + lowercaseFieldValue(o, "side");
  ret += `${o.symbol} price=${o.price} qty=${o.origQty}`;
  if (o.stopPrice && o.stopPrice !== "0") {
    ret += nonzeroField(o, "stopPrice");
  }
  ret += nonzeroField(o, "orderId");
  if (o.time && o.time !== "0") {
    ret += " date=" + new Date(o.time).toLocaleString("en-GB", { timeZone: outputTimeZone });
  }
  ret += "'";
  return ret;
};

module.exports = { orderLabel };
