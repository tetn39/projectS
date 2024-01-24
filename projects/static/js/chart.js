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
      data: [],
      fill: true,
      backgroundColor: "rgba(0, 255, 92, 0.5)",
      borderColor: "rgb(0, 255, 92)",
      pointBackgroundColor: "rgb(0, 0, 0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
  ],
};

const fontSpec = {
  family: "sans-serif",
  size: 16,
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
        min: 0,
        max: 120,
        pointLabels: {
          color: "#fff",
          font: fontSpec,
        
        },
        angleLines: {
          color: "#fff",
        },
        grid: {
          color: "#fff",
        },
        ticks: {
          stepSize: 20,
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

// 3. Chart.jsのdataオブジェクトを更新する関数
function updateChartData(userStatus) {
  // チャートに表示するデータ
  const newData = [
    userStatus.acousticness,
    userStatus.danceability,
    userStatus.energy,
    userStatus.instrumentalness,
    userStatus.liveness,
    userStatus.loudness,
    userStatus.speechiness,
    userStatus.tempo,
    userStatus.valence,
  ];

  console.log(newData);

  // dataオブジェクトの更新
  myRadarChart.data.datasets[0].data = newData;

  // チャートの再描画
  myRadarChart.update();
}

// ページが読み込まれたときに実行されるコード
document.addEventListener("DOMContentLoaded", function () {
  // パラメータからuser_statusを取得
  const params = new URLSearchParams(window.location.search);
  const userStatusParam = params.get("user_status");

  // user_statusが存在する場合はJSONパースしてチャートを更新
  if (userStatusParam) {
    const userStatus = JSON.parse(userStatusParam);
    updateChartData(userStatus);
  }
});
