// Your Chart.js configuration

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


async function getAccessToken() {
  // CSRFトークンを取得
  const csrftoken = getCookie("csrftoken");

  // get_token/ からGETしてアクセストークンを取得する
  const response = await fetch("/get_token/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });

  const data = await response.json();
  return data;
}

function createTrackDiv(track) {
  const trackDiv = document.createElement("div");

  trackDiv.classList.add("reccomend__musics__wrap");

  trackDiv.classList.add("track-div");

  // リンクを作成
  const trackLink = document.createElement("a");
  trackLink.href = track.external_urls.spotify; // Spotifyの曲ページへのリンクを設定
  trackLink.target = "_blank"; // 新しいタブで開くように設定（任意）

  // アルバム画像を作成し、リンク内に追加
  const albumImage = document.createElement("img");
  albumImage.src = track.album.images[0].url;
  albumImage.alt = "Album Cover";
  albumImage.classList.add("album-image");
  trackLink.appendChild(albumImage);

  // トラック情報を表示する要素を作成
  const trackInfo = document.createElement("div");
  trackInfo.classList.add("track-info");

  // トラック名を表示する要素を作成
  const trackNameDiv = document.createElement("div");
  trackNameDiv.textContent = track.name;
  trackNameDiv.classList.add("track-name");

  // アーティスト名を表示する要素を作成
  const artistNameDiv = document.createElement("div");
  artistNameDiv.textContent = track.artists[0].name;
  artistNameDiv.classList.add("artist-name");

  // トラック情報を追加
  trackInfo.appendChild(trackNameDiv);
  trackInfo.appendChild(artistNameDiv);

  // 作成した要素を trackDiv に追加
  trackLink.appendChild(trackInfo);
  trackDiv.appendChild(trackLink);

  return trackDiv;
}

async function getTrackInfo(trackId, accessToken) {


  // Spotify Web API で曲の情報を取得するエンドポイントを指定
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + accessToken.access_token },
  });

  return await response.json(); // 取得した情報をJSON形式で返す
}

async function displayRecommendedMusicWithInfo(recommendedMusic) {
  // recommendedMusic を表示する要素の親要素を取得
  const recommendedMusicContainer = document.getElementById("recommend__images__wrap");

  // recommendedMusic をクリアする
  recommendedMusicContainer.innerHTML = "";
  const accessToken = await getAccessToken(); // アクセストークンを取得する関数を呼び出す
  // recommendedMusic の各曲に対して繰り返し処理を行う
  for (const trackId of recommendedMusic) {
    try {
      // 曲の情報を取得
      const trackInfo = await getTrackInfo(trackId, accessToken);

      // 取得した情報を表示する要素を作成
      const trackDiv = createTrackDiv(trackInfo);

      // 作成した要素を recommendedMusicContainer に追加
      recommendedMusicContainer.appendChild(trackDiv);
      console.log(recommendedMusicContainer)
    } catch (error) {
      console.error("Error fetching track info:", error);
    }
  }
}


function send(diaId) {
  console.log("実行");
  console.log(diaId);
  var csrftoken = getCookie("csrftoken");
  return fetch("/js_py_diagnosis_id/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ DiagnosisId: diaId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("jsから:", diaId);
      console.log("pyから:", data.user_status);
      console.log("pyから:", data.recommended_music);
      return [data.user_status, data.recommended_music];
    })
    .catch((error) => {
      console.error("Error:", error);
      // エラーメッセージを取得
      var errorMessage = error.message;
      // エラーが発生した箇所を取得
      var errorStack = error.stack;
      // 送信データを取得
      var sendData = JSON.stringify({ DiagnosisId: diaId });

      // コンソールに出力
      console.log("errorMessage:", errorMessage);
      console.log("errorStack:", errorStack);
      console.log("sendData:", sendData);
      throw error; // エラーを再スローして呼び出し元に伝播させる
    });
}

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

async function yourTypeIs(userStatus) {
  // 数値をもとにもどす
  // foreach使ってuserStatusの値を取り出す
  const userStatusArray = Object.entries(userStatus);
  userStatusArray.forEach(([key, value]) => {
    if (key !== "tempo" && key !== "loudness" && key !== "mode") {
      userStatus[key] = parseFloat(((value - 20) / 100).toFixed(4));
    } else if (key === "tempo") {
      userStatus[key] = value * 2;
    } else if (key === "loudness") {
      userStatus[key] = parseFloat((value - 90).toFixed(4));
    }
  }
  );
  console.log(userStatus);

  // 参考
  /*
const preferences = [];

  // Acousticness
  if (userStatus.acousticness >= 0 && userStatus.acousticness < 0.3) {
    preferences.push("電子音が好き");
  } else if (userStatus.acousticness >= 0.7 && userStatus.acousticness <= 1) {
    preferences.push("生楽器の音が好き");
  }

  // Danceability
  if (userStatus.danceability >= 0.7 && userStatus.danceability <= 1) {
    preferences.push("ダンスしやすい曲が好き");
  }




  ### Acousticness
- 0から0.3: 電子音が好き
- 0.7から1: 生楽器の音が好き

### Danceability
- 0.7から1: ダンスしやすい曲が好き

### Energy
- 0から0.3: ゆったりした曲が好き
- 0.7から1: 激しい曲が好き

### Instrumentalness
- 0から0.3: 歌ものが好き
- 0.7から1: インストゥルメンタルが好き

### Liveness
- 0.8から1: ライブ音源が好き

### Loudness
- -60.0dBまで: 静かな曲が好き
- 0.0dB以上: 音圧が強い曲が好き

### Speechiness
- ボーカルが話している感じの強さ。ラップ曲などで0.33から0.66の範囲。

### Valence
- 0から0.3: 暗い曲が好き
- 0.7から1: 明るい曲が好き

### Mode
- 0から0.3: メジャーコードが好き
- 0.7から1: マイナーコードが好き

  */

  const preferences = []

  // Acousticness
  if (userStatus.acousticness < 0.3) {
    preferences.push("電子音が好き");
  } else if (userStatus.acousticness >= 0.7) {
    preferences.push("生楽器の音が好き");
  }

  // Danceability
  if (userStatus.danceability >= 0.7) {
    preferences.push("ダンスしやすい曲が好き");
  }

  // Energy
  if (userStatus.energy < 0.3) {
    preferences.push("ゆったりした曲が好き");
  } else if (userStatus.energy >= 0.7) {
    preferences.push("激しい曲が好き");
  }

  // Instrumentalness
  if (userStatus.instrumentalness < 0.3) {
    preferences.push("歌ものが好き");
  } else if (userStatus.instrumentalness >= 0.7) {
    preferences.push("インストゥルメンタルが好き");
  }

  // Liveness
  if (userStatus.liveness >= 0.8) {
    preferences.push("ライブ音源が好き");
  }

  // Loudness
  if (userStatus.loudness <= -60) {
    preferences.push("静かな曲が好き");
  } else if (userStatus.loudness >= 0) {
    preferences.push("音圧が強い曲が好き");
  }

  // Speechiness
  if (userStatus.speechiness >= 0.33 && userStatus.speechiness < 0.66) {
    preferences.push("ボーカルが話している感じの強さ");
  }

  // Valence
  if (userStatus.valence < 0.3) {
    preferences.push("暗い曲が好き");
  } else if (userStatus.valence >= 0.7) {
    preferences.push("明るい曲が好き");
  }

  // Mode
  if (userStatus.mode < 0.3) {
    preferences.push("メジャーコードが好き");
  } else if (userStatus.mode >= 0.7) {
    preferences.push("マイナーコードが好き");
  }

  console.log(preferences);
}


function fromDiagnosisId(diaId) {
  send(diaId)
    .then(([userStatus, recommendedMusic]) => {
      displayRecommendedMusicWithInfo(recommendedMusic);
      updateChartData(userStatus);
      yourTypeIs(userStatus);
    })
    .catch((error) => {
      // エラー処理
      console.error("An error occurred:", error);
    });
}

// ページが読み込まれたときに実行されるコード
document.addEventListener("DOMContentLoaded", function () {
  // パラメータからuser_statusを取得
  const params = new URLSearchParams(window.location.search);
  const userStatusParam = params.get("user_status");
  const diagnosisIdParam = params.get("diagnosis_id");

  // user_statusが存在する場合はJSONパースしてチャートを更新

  if (diagnosisIdParam) { //diagnosisIdが存在する場合
    fromDiagnosisId(diagnosisIdParam);
  }
});


