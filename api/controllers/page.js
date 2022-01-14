const axios = require("axios");

const api = process.env.API;

const utils = require("../../utils/utils");

function getSort(sort) {
  let sorter;
  let name;
  switch (sort) {
    //Sort Ascending by Value
    case "ascval":
      sorter = (first, second) => first.value - second.value;
      name = "Asc. Value";
      break;
    //Sort Descending by Value
    case "descval":
      sorter = (first, second) => second.value - first.value;
      name = "Desc. Value";
      break;
    //Sort Descending by Name
    case "descname":
      sorter = (first, second) => (first.name < second.name ? 1 : -1);
      name = "Desc. Name";
      break;
    //Sort Ascending by Name
    case "ascname":
    default:
      sorter = (first, second) => (first.name > second.name ? 1 : -1);
      name = "Asc. Name";
      break;
  }
  return { sorter, name };
}

const page_index = async (req, res) => {
  const { sort } = req.query;
  const { name: sortName, sorter } = getSort(sort);
  const promises = utils.coins.ids.map((id) => {
    return new Promise(async (resolve, reject) => {
      const request = axios({
        method: "get",
        url: `${api}/coins/${id}`,
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false,
        },
      });

      try {
        const response = await request;
        const { id, name, symbol, image, market_data } = response.data;

        const obj = {
          name,
          symbol: symbol.toUpperCase(),
          image: image.small,
          value: Math.floor(market_data.current_price.usd * 1000) / 1000,
          url: `/charts/${id}`,
        };

        // console.log(obj.name, obj.value);

        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  });

  const coinData = await Promise.all(promises);
  coinData.sort(sorter);

  res.render("index", {
    coinData,
    bootstrap: true,
    sortOptionName: sortName,
  });
};

const page_chart = async (req, res, next) => {
  const { coinId } = req.params;
  if (!utils.coins.checkCoinId(coinId)) {
    const err = new Error("Request failed - Bad Coin Id");
    err.status = 422;
    res.locals.err = err;
    next();
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
      developer_data: false,
    },
  });

  try {
    const { name, image, symbol, market_data } = response.data;
    const coinName = name[0].toUpperCase() + name.slice(1); //Change later
    res.render("chart", {
      chart: true,
      bootstrap: true,
      extendTitle: coinName,
      image: image.small,
      value: market_data.current_price.usd,
      symbol,
      coinName,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { page_index, page_chart };
