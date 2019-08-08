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

const ctx = document.getElementById("myChart");

const defaultDataset = {
  //Default configuration for each new dataset
  fill: false,
  borderWidth: 3,
  lineTension: 0,
  pointRadius: 0,
  pointHitRadius: 30
};

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], //X Axis labels
    datasets: [] //Values for plotting + how chart line looks
  },
  options: {
    legend: { display: false },
    tooltips: {
      displayColors: false,
      callbacks: {
        title: function(tooltipItem, data) {
          const time = data.labels[tooltipItem[0].index];
          return time.format("Do MMM HH:mm");
        },
        label: function(tooltipItem, data) {
          return (
            data.datasets[tooltipItem.datasetIndex].label +
            ` $${tooltipItem.yLabel.toLocaleString()}`
          );
        }
      }
    },
    scales: {
      yAxes: [
        {
          gridLines: { borderDash: [5, 5] },
          ticks: {
            fontColor: "#007bff",
            callback: function(value, index, values) {
              return "$" + value.toLocaleString();
            }
          }
        }
      ],
      xAxes: [
        {
          gridLines: { display: false },
          ticks: {
            fontColor: "#007bff",
            callback: function(item, index) {
              if (!(index % 24)) return item.format("Do MMM");
              else return "";
            },
            autoSkip: false
          }
        }
      ]
    }
  }
});

async function newLine(chart) {
  const coinId = sessionStorage.getItem("coinId");
  const request = axios({ method: "get", url: `/data/${coinId}` });

  try {
    const response = await request;
    const { prices } = response.data;
    const chartData = prices.reduce(
      (acc, pair) => {
        acc.dates.push(moment(pair[0]));
        acc.data.push(pair[1]);
        return acc;
      },
      { dates: [], data: [] }
    );

    const borderColor = await getColor();

    const label = sessionStorage.getItem("symbol");

    const newDataset = Object.assign(defaultDataset, {
      label,
      data: chartData.data,
      borderColor
    });

    myChart.data.labels = chartData.dates;
    myChart.data.datasets.push(newDataset);
    myChart.update();
  } catch (error) {
    console.log(error);
  }
}

newLine(myChart);

async function getColor() {
  return new Promise(async (resolve, reject) => {
    const request = axios({
      method: "get",
      url: "/data/misc/color"
    });
    try {
      const response = await request;
      const { color } = response.data;
      resolve(color);
    } catch (error) {
      reject(error);
    }
  });
}
