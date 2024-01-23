// Your Chart.js configuration
const data = {
  labels: [
    "アコースティック感",
    "ダンスしやすさ",
    "エナジー感",
    "インスト感",
    "ライブ感",
    "音圧",
    "スピーチ感",
    "曲のテンポ",
    "曲の明るさ",
  ],
  datasets: [
    {
      label: "今回の診断結果",
      data: [65, 59, 90, 81, 56, 55, 40, 59, 30],
      fill: true,
      backgroundColor: "rgba(0, 255, 92, 0.2)",
      borderColor: "rgb(0, 255, 92)",
      pointBackgroundColor: "rgb(0, 0, 0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "前回の診断結果",
      data: [28, 48, 40, 19, 96, 27, 100, 70, 30],
      fill: true,
      backgroundColor: "rgba(189, 0, 255, 0.2)",
      borderColor: "rgb(189, 0, 255)",
      pointBackgroundColor: "rgb(0, 0, 0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(54, 162, 235)",
    },
  ],
};

const fontSpec = {
  family: "sans-serif",
  size: 16, // Change the font size as needed
  style: "normal",
  weight: "bold",
  lineHeight: 1.2,
};

const config = {
  type: "radar",
  data: data,
  options: {
    scales: {
      r: {
        backgroundColor: "#000",
        pointLabels: {
          color: "#fff",
          // backdropColor: "#000",
          font: fontSpec,
        },
        angleLines: {
          color: "#fff",
        },
        grid: {
          color: "#fff",
        },
        ticks: {
          textStrokeColor: "#fff",
          backdropColor: "rgba(255, 255, 255, 0)",
          maxTicksLimit: 6,
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  },
};

// Get the canvas element
const ctx = document.getElementById("myRadarChart").getContext("2d");

// Create a new radar chart
const myRadarChart = new Chart(ctx, config);
