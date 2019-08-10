const { pathname } = window.location;
const start = pathname.lastIndexOf("/");
const coin = pathname.slice(start + 1);

sessionStorage.setItem("coinId", coin);

axios
  .get(`/data/${coin}/symbol`)
  .then(response => {
    const { symbol } = response.data;
    sessionStorage.setItem("symbol", symbol.toUpperCase());
  })
  .catch(error => {
    console.log(error);
  });

const getColor = (() => {
  const rndHex = () => Math.floor(Math.random() * 256).toString(16);
  return () => `#${rndHex()}${rndHex()}${rndHex()}`;
})();

const updateCoinValue = () => {
  const coinId = sessionStorage.getItem("coinId");
  axios
    .get(`../data/${coinId}/value`, {
      params: {
        currency: "usd"
      }
    })
    .then(response => {
      const { value } = response.data;
      document.getElementById(
        "value"
      ).innerHTML = `$ ${value.toLocaleString()}`;
    })
    .catch(error => {
      console.log(error.data);
    });
};

setInterval(updateCoinValue, 15000);
