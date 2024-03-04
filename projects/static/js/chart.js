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
    
    // const maxPreference = Math.max(...Object.values(userStatus));

    // const filteredValues = Object.entries(userStatus)
    //   .filter(([key, value]) => key !== 'mode') // 'mode'を除外
    //   .map(([key, value]) => value); // 値だけを取り出す

    // const minPreference = Math.min(...filteredValues);


    // console.log(maxPreference);
    // console.log(minPreference);
  // status内で一番高い値と一番低い値のkeyを取得する
  const maxPreference = Math.max(...Object.values(userStatus));
  const filteredValues = Object.entries(userStatus)
  .filter(([key, value]) => key !== 'mode') // 'mode'を除外
  .map(([key, value]) => value); // 値だけを取り出す

  const minPreference = Math.min(...filteredValues);
  console.log(maxPreference);
  console.log(minPreference);
  const maxPreferenceKey = Object.keys(userStatus).find(key => userStatus[key] === maxPreference);
  const minPreferenceKey = Object.keys(userStatus).find(key => userStatus[key] === minPreference);
  console.log(maxPreferenceKey);
  console.log(minPreferenceKey);

  // TODO: ここでuserStatusの値をもとにもどす



  // 数値をもとにもどす
  // foreach使ってuserStatusの値を取り出す
  const userStatusArray = Object.entries(userStatus);
  userStatusArray.forEach(([key, value]) => {
    if (key !== "tempo" && key !== "loudness" && key !== "mode" && key !== "danceability") {
      userStatus[key] = parseFloat(((value - 20) / 100).toFixed(4));
    } else if (key === "tempo") {
      userStatus[key] = value * 2;
    } else if (key === "loudness") {
      userStatus[key] = parseFloat((value - 90).toFixed(4));
    } else if (key === "danceability") {
      if (value > 100) {
        value -= 20;
      }
      userStatus[key] = parseFloat((value / 100).toFixed(4));
    }
  }
  );
  console.log(userStatus);

  const preferences = [];
  const preferStatus = [];
  const topPreference = "";
  // Acousticness
  if (userStatus.acousticness < 0.3) {
    preferences.push("電子音の多い曲");
    preferStatus.push("acousticness");
  } else if (userStatus.acousticness >= 0.7) {
    preferences.push("生楽器の多い曲");
    preferStatus.push("acousticness");
  }

  // Danceability
  if (userStatus.danceability >= 0.8) {
    preferences.push("踊りやすい曲");
    preferStatus.push("danceability");
  } else if (userStatus.danceability < 0.4) {
    preferences.push("しっとりした曲");
    preferStatus.push("danceability");
  }

  // Energy
  if (userStatus.energy < 0.3) {
    preferences.push("ゆったりした曲");
    preferStatus.push("energy");
  } else if (userStatus.energy >= 0.7) {
    preferences.push("激しい曲");
    preferStatus.push("energy");
  }

  // Instrumentalness
  if (userStatus.instrumentalness < 0.3) {
    preferences.push("歌ものの曲");
    preferStatus.push("instrumentalness");
  } else if (userStatus.instrumentalness >= 0.7) {
    preferences.push("楽器系の曲");
    preferStatus.push("instrumentalness");
  }

  // Liveness
  if (userStatus.liveness >= 0.8) {
    preferences.push("ライブ感のある曲");
    preferStatus.push("liveness");
  }

  // Loudness
  if (userStatus.loudness <= -60) {
    preferences.push("静かな曲");
    preferStatus.push("loudness");
  } else if (userStatus.loudness >= 0) {
    preferences.push("音圧が強い曲");
    preferStatus.push("loudness");
  }

  // Speechiness
  if (userStatus.speechiness >= 0.33 && userStatus.speechiness < 0.66) {
    preferences.push("ラップみたいな曲");
    preferStatus.push("speechiness");
  }

  // Valence
  if (userStatus.valence < 0.3) {
    preferences.push("暗い曲");
    preferStatus.push("valence");
  } else if (userStatus.valence >= 0.7) {
    preferences.push("明るい曲");
    preferStatus.push("valence");
  }

  // Mode
  if (userStatus.mode < 0.2) {
    preferences.push("メジャーコード");
    preferStatus.push("mode");
  } else if (userStatus.mode >= 0.8) {
    preferences.push("マイナーコード");
    preferStatus.push("mode");
  }

  console.log(preferences);

  // yourTypeTitle　タイトルを付ける
  const yourTypeTitle = document.getElementById('yourTypeTitle');
  yourTypeTitle.innerHTML = "あなたは<br>";
  const maxPrefer = preferStatus.indexOf(maxPreferenceKey);
  const minPrefer = preferStatus.indexOf(minPreferenceKey);

  if (maxPrefer !== -1) {
    yourTypeTitle.innerHTML += "<span>" + preferences[maxPrefer];
  } else if (minPrefer !== -1) {
    yourTypeTitle.innerHTML += "<span>" + preferences[minPrefer];
  } else {
    yourTypeTitle.innerHTML += "どれも平均的な曲";
  }
  yourTypeTitle.innerHTML += "</span>" + "が<br>好きなタイプです";



  // chart__text__typeに表示
  const container = document.getElementById('yourType');
  const list = document.createElement('ul'); // リスト要素を作成

  preferences.forEach(preference => {
    const listItem = document.createElement('li'); // リストアイテム要素を作成
    listItem.textContent = preference; // テキストを設定
    listItem.textContent += "が好き"
    list.appendChild(listItem); // リストにアイテムを追加
  });

  container.appendChild(list); // コンテナにリストを追加



  // // yourTypeDescription に詳細を書く
  const yourTypeDescription = document.getElementById('yourTypeDescription');
  const description = document.createElement('p');

  description.textContent = "あなたは";
  preferences.forEach(preference => {
    description.textContent += preference; // テキストを設定
    description.textContent += "が好き、";

  });

  description.textContent += "という特徴があります";
  


  yourTypeDescription.appendChild(description);
  changeTweetText();
}


function fromDiagnosisId(diaId) {
  // setOgUrl(diaId);
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

// metaタグのurlを診断ごと、動的にする
function setOgUrl(diaId) {
  const baseUrl = "https://melodystatus.com/status/";
  const urlParams = new URLSearchParams({ diagnosis_id: diaId });
  const ogUrl = baseUrl + "?" + urlParams.toString();
  
  document.querySelector('meta[property="og:url"]').setAttribute("content", ogUrl);
  console.log("URL", ogUrl);
}

// クリップボードにテキストをコピーする関数
function copyTextToClipboard(text) {
    // 一時的なinput要素を作成してテキストをセット
    var tempInput = document.createElement('input');
    tempInput.value = text;

    // input要素をDOMに追加
    document.body.appendChild(tempInput);

    // input要素内のテキストを選択
    tempInput.select();

    // テキストをクリップボードにコピー
    document.execCommand('copy');

    // 一時的なinput要素を削除
    document.body.removeChild(tempInput);
}

// ツイートのテキストを生成してTwitter共有ボタンのhref属性を更新する関数
function changeTweetText() {
    // 現在のページのURL
    const dynamicUrl = window.location.href;

    // yourTypeTitleのテキスト
    const yourTypeTitleText = yourTypeTitle.querySelector('span').innerText.trim();

    // ツイートのタイトル
    const yourTypeTextTitle = "診断結果は...「" + yourTypeTitleText + "が好きなタイプ」でした！🤘";

    // 特徴のテキストを取得
    let yourTypeText = "特徴：\n";
    const yourTypeList = document.getElementById('yourType').querySelectorAll('ul li');
    Array.from(yourTypeList).forEach((li) => {
        const liText = li.textContent.trim();
        if (liText !== yourTypeTitleText + "が好き") {
            yourTypeText += liText + "\n";
        }
    });

    // 絵文字のマッピング
    const emojis = {
        "電子音の多い曲": "🎛️ 電子音の多い曲",
        "生楽器の多い曲": "🎻 生楽器の多い曲",
        "踊りやすい曲": "💃 踊りやすい曲",
        "しっとりした曲": "🌙 しっとりした曲",
        "ゆったりした曲": "😌 ゆったりした曲",
        "激しい曲": "🔥 激しい曲",
        "歌ものの曲": "🎤 歌ものの曲",
        "楽器系の曲": "🎸 楽器系の曲",
        "ライブ感のある曲": "🎉 ライブ感のある曲",
        "静かな曲": "🤫 静かな曲",
        "音圧が強い曲": "💥 音圧が強い曲",
        "ラップみたいな曲": "🔫 ラップみたいな曲",
        "暗い曲": "🌑 暗い曲",
        "明るい曲": "☀️ 明るい曲",
        "メジャーコード": "🎹 メジャーコード",
        "マイナーコード": "🎹 マイナーコード",
    };

    // 絵文字を適用
    Object.keys(emojis).forEach(key => yourTypeText = yourTypeText.replace(new RegExp(key, 'g'), emojis[key]));

    // ハッシュタグ
    const hashTags = "\n" + "#好きな曲診断" + " #メロタス";

    // ツイートの本文
    const tweetText = yourTypeTextTitle + "\n\n" + yourTypeText + hashTags + "\n" + dynamicUrl;

    // Twitter共有ボタンのhref属性を更新
    const twitterShareBtn = document.getElementById("twitter__share");
    twitterShareBtn.href = "https://twitter.com/intent/tweet?url=" + "&text=" + encodeURIComponent(tweetText);
}


// ページが読み込まれたときに実行されるコード
document.addEventListener('DOMContentLoaded', function () {
    const urlButton = document.getElementById('url__copy');

    if (urlButton) {
        urlButton.addEventListener('click', function (event) {
            event.preventDefault();
            copyTextToClipboard(window.location.href);
        });
    }

    // パラメータからuser_statusを取得
    const params = new URLSearchParams(window.location.search);
    const userStatusParam = params.get("user_status");
    const diagnosisIdParam = params.get("diagnosis_id");

    // user_statusが存在する場合はJSONパースしてチャートを更新
    if (diagnosisIdParam) {
        fromDiagnosisId(diagnosisIdParam);
    }
});