const path = require("path");
const handlebars = require("express-handlebars");

//Helpers
const equals = (p1, p2) => p1 == p2;
const localeString = number => number.toLocaleString();
const title = () => "My Crypto Charts";
const toUpperCase = string => string.toUpperCase();

//Creating engine
const hbs = handlebars.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "../", "views/layouts"),
  helpers: {
    equals,
    localeString,
    title,
    toUpperCase
  }
});

module.exports = hbs.engine;
