const { DATA_DIR } = require("./constants");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(DATA_DIR + "/db-binfutorderswatch.json");
const db = low(adapter);

function loadDB(key) {
  db.defaults({ [key]: [] }).write();
  return db.get(key, []).value();
}

function saveDB(key, data) {
  db.set(key, data).write();
}

module.exports = { loadDB, saveDB };
