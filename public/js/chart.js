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
            callback: (value, index, values) => "$" + value.toLocaleString()
          }
        }
      ],
      xAxes: [
        {
          gridLines: { display: false },
          ticks: {
            fontColor: "#007bff",
            callback: (item, index) =>
              !(index % 24) ? item.format("Do MMM") : "",
            autoSkip: false
          }
        }
      ]
    }
  }
});

async function newLine(chart) {
  return new Promise(async (resolve, reject) => {
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

      const borderColor = getColor();

      const label = sessionStorage.getItem("symbol");

      const newDataset = Object.assign(defaultDataset, {
        label,
        data: chartData.data,
        borderColor
      });

      myChart.data.labels = chartData.dates;
      myChart.data.datasets.push(newDataset);
      myChart.update();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function resize() {
  $("#myChart").outerHeight(
    $(window).height() -
      $("#myChart").offset().top -
      Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight())
  );
}

$(document).ready(function() {
  resize();
  $(window).on("resize", function() {
    resize();
  });
});
