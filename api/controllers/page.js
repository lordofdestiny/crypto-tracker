const axios = require("axios");

require("dotenv").config();
const api = process.env.API;

const { ids } = require("../coins");

const page_index = async (req, res) => {
  const promises = ids.map(id => {
    return new Promise(async (resolve, reject) => {
      const request = axios({
        method: "get",
        url: `${api}/coins/${id}`,
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false
        }
      });

      try {
        const response = await request;
        const { id, name, symbol, image, market_data } = response.data;

        const obj = {
          name,
          symbol: symbol.toUpperCase(),
          image: image.small,
          value: market_data.current_price.usd,
          url: `/charts/${id}`
        };

        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  });

  const coinData = await Promise.all(promises);

  res.render("index", {
    bootstrap: true,
    coinData
  });
};

const page_chart = async (req, res) => {
  const { coinId } = req.params;
  if (!ids.includes(coinId)) {
    const error = new Error("Request Failed - Not Found");
    error.status = 404;
    res.render("error", { error });
    return;
  }
  //Get coin name
  const response = await axios({
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
    const { name, image, symbol } = response.data;
    const coinName = name[0].toUpperCase() + name.slice(1); //Change later
    res.render("chart", {
      chart: true,
      bootstrap: true,
      extendTitle: coinName,
      image: image.small,
      symbol,
      coinName
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { page_index, page_chart };
