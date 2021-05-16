const path = require("path");
const { DATA_DIR } = require("./constants");
require("dotenv").config({ path: path.resolve(__dirname, DATA_DIR + "/.env") });

const { loadDB, saveDB } = require("./db-lowdb");
const { run } = require("./main");

(async function () {
  const dbProvider = {
    loadDB,
    saveDB,
  };
  run(dbProvider, process.env);
})();
console.log("Running");
