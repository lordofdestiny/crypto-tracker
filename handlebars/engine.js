const path = require("path");
const handlebars = require("express-handlebars");

//Load Helpers
const helpers = require("./helpers");

//Creating engine
const hbs = handlebars.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "../", "views/layouts"),
  helpers
});

module.exports = hbs.engine;
