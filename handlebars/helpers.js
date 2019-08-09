const fs = require("fs");
const path = require("path");

const directory = path.join(__dirname, "helpers");

module.exports = fs.readdirSync(directory).reduce((acc, file) => {
  const fileName = file.split(".")[0];
  acc[fileName] = require(path.join(directory, fileName));
  return acc;
}, {});
