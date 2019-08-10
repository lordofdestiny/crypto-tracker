const { ids } = require("./coins.json");

const checkCoinId = id => ids.includes(id);

module.exports = {
  checkCoinId
};
