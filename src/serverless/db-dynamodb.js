const AWS = require("aws-sdk");

const FUTURESORDERS_TABLE = process.env.FUTURESORDERS_TABLE;
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = "localhost";
  dynamoDbClientParams.endpoint = "http://localhost:8000";
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

async function loadDB(key) {
  const params = {
    TableName: FUTURESORDERS_TABLE,
    Key: {
      id: key,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      let { payload } = Item;
      console.log("dynamodb payload: " + payload);
      return JSON.parse(payload || "[]");
    } else {
      console.error("Could not find key " + key);
    }
  } catch (error) {
    console.log(error);
  }

  return [];
}

async function saveDB(key, data) {
  const params = {
    TableName: FUTURESORDERS_TABLE,
    Item: {
      id: key,
      payload: JSON.stringify(data || []),
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

module.exports = { loadDB, saveDB };
