const path = require("path");
const morgan = require("morgan");
const express = require("express");

//Middleware includes
const errorMiddleware = require("./api/middleware/error");

//Hbs engine
const hbsEngine = require("./handlebars/engine");

//Route includes
const pageRouter = require("./api/routes/pages");
const dataRouter = require("./api/routes/data");

const app = express();

//Dev middleware
app.use(morgan("dev"));

//Set Handlebars as view engine
app.engine("hbs", hbsEngine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//Allow public files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", pageRouter);
app.use("/data", dataRouter);

app.use(errorMiddleware.error_not_found);
app.use(errorMiddleware.error_not_caught);

module.exports = app;
