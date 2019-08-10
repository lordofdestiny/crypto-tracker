const axios = require("axios");

const api = process.env.API;

const utils = require("../../utils/utils");

const data_chart = async (req, res, next) => {
  const { coinId } = req.params;
  if (!utils.coins.checkCoinId(coinId)) {
    const err = new Error("Request failed - Bad Coin Id");
    err.status = 422;
    res.locals.err = err;
    next();
    return;
  }
  const request = axios({
    method: "get",
    url: `${api}/coins/${coinId}/market_chart`,
    params: {
      vs_currency: "usd",
      days: 7
    }
  });
  try {
    const response = await request;
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
};

const data_symbol = async (req, res, next) => {
  const { coinId } = req.params;
  if (!utils.coins.checkCoinId(coinId)) {
    const err = new Error("Request failed - Bad Coin Id");
    err.status = 422;
    res.locals.err = err;
    next();
    return;
  }
  const request = axios({
    method: "get",
    url: `${api}/coins/${coinId}`,
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false
    }
  });
  try {
    const response = await request;
    const { symbol } = response.data;
    res.json({ symbol });
  } catch (error) {
    console.log(error);
  }
};

const data_value = async (req, res, next) => {
  const { coinId } = req.params;
  if (!utils.coins.checkCoinId(coinId)) {
    const err = new Error("Request failed - Bad Coin Id");
    err.status = 422;
    res.locals.err = err;
    next();
    return;
  }
  const { currency } = req.query;
  const request = axios({
    method: "get",
    url: `${api}/simple/price`,
    params: {
      ids: coinId,
      vs_currencies: currency
    }
  });
  try {
    const response = await request;
    const value = response.data[coinId][currency];
    res.json({ value });
  } catch (error) {
    console.log(error.data);
  }
};

module.exports = { data_chart, data_symbol, data_value };
