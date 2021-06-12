const { loadDB, saveDB } = require("./db-dynamodb");
const { run } = require("../main/run");

const runner = async function () {
  const dbProvider = {
    loadDB,
    saveDB,
  };
  await run(dbProvider, process.env);
};

module.exports = {
  runner,
};
