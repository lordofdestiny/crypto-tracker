const fs = require("fs");
const path = require("path");

module.exports = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(folder => {
    const dir = path.join(__dirname, folder.name);
    return fs.readdirSync(dir).filter(file => file ===`${folder.name}.js`)[0];
  })
  .reduce((acc, file) => {
    if (file) {
      const fileName = file.split(".")[0];
      acc[fileName] = require(path.join(__dirname, fileName, `${fileName}.js`));
    }
    return acc;
  }, {});
