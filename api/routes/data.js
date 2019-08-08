const express = require("express");

require("dotenv").config();

const controller = require("../controllers/data");

const router = express.Router();

router.get("/:coinId", controller.data_chart);

router.get("/misc/color", controller.data_color);

router.get("/:coinId/symbol", controller.data_symbol);

module.exports = router;
