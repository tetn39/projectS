let selectedTracks = [];
let selectedUris = [];

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

// Spotifyでトラックを検索する関数
async function searchSpotify(access_token, query) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=9`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );
  return await response.json();
}

// トラックを選択リストに追加する関数
function addTrackToList(track) {
  // 既に選択されているかを確認
  const isAlreadySelected = selectedUris.includes(track.uri.substr(14));

  if (!isAlreadySelected) {
    selectedTracks.push(track);
    selectedUris.push(track.uri.substr(14));
    renderSelectedTracks();
    console.log("Selected URIs:", selectedUris);
  } else {
    console.log("既に選択されています");
  }
}

// 選択されたトラックを表示する関数
function renderSelectedTracks() {
  renderSelectedTracksWithIndex();

  // 選択された曲がある場合
  if (selectedTracks.length > 0) {
    // 「選択済みの曲」ヘッダーを表示
    document.getElementById("selectedTracksHeader").style.display = "block";

    // 「診断する」ボタンのラッパーを表示
    document.getElementById("diagnosisButtonWrap").style.display = "block";
  } else {
    // 選択された曲がない場合
    // 「選択済みの曲」ヘッダーを非表示
    document.getElementById("selectedTracksHeader").style.display = "none";

    // 「診断する」ボタンのラッパーを非表示
    document.getElementById("diagnosisButtonWrap").style.display = "none";
  }
}

// 選択されたトラックを配列番号と共に表示する関数
function renderSelectedTracksWithIndex() {
  const listContainer = document.getElementById("selectedTracks");
  listContainer.innerHTML = "";

  selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track, index);
    const indexLabel = createIndexLabel(index);
    trackDiv.insertBefore(indexLabel, trackDiv.firstChild);
    const deleteButton = createDeleteButton(index);
    trackDiv.appendChild(deleteButton);
    listContainer.appendChild(trackDiv);
  });
}

// 配列番号を表示するためのラベルを作成
function createIndexLabel(index) {
  const indexLabel = document.createElement("div");
  indexLabel.textContent = `#${index + 1}`; // 配列番号は1から始まるようにするため +1
  indexLabel.classList.add("index-label");
  return indexLabel;
}

// 選択されたトラックを表示するためのDIVを作成する関数
function createTrackDiv(track, index = 0) {
  const trackDiv = document.createElement("div");

  // indexが偶数の場合はevenクラスを、奇数の場合はoddクラスを追加
  console.log("Index value:", index);

  if (index % 2 === 0) {
    trackDiv.classList.add("even");
  } else {
    trackDiv.classList.add("odd");
  }

  trackDiv.classList.add("track-div");

  const albumImage = document.createElement("img");
  albumImage.src = track.album.images[0].url;
  albumImage.alt = "Album Cover";
  albumImage.classList.add("album-image");

  const trackInfo = document.createElement("div");
  trackInfo.classList.add("track-info");

  // トラック情報のための三つの div を作成
  const trackNameDiv = document.createElement("div");
  trackNameDiv.textContent = track.name;
  trackNameDiv.classList.add("track-name");

  const albumNameDiv = document.createElement("div");
  albumNameDiv.textContent = track.album.name;
  albumNameDiv.classList.add("album-name");

  const artistNameDiv = document.createElement("div");
  artistNameDiv.textContent = track.artists[0].name;
  artistNameDiv.classList.add("artist-name");

  // 三つの div を trackInfo に追加
  trackInfo.appendChild(trackNameDiv);
  trackInfo.appendChild(albumNameDiv);
  trackInfo.appendChild(artistNameDiv);
  trackDiv.appendChild(albumImage);
  trackDiv.appendChild(trackInfo);

  return trackDiv;
}

// 選択されたトラックを削除するボタンを作成する関数
function createDeleteButton(index) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    removeTrackFromList(index);
  });
  return deleteButton;
}

// 選択されたトラックをリストから削除する関数
function removeTrackFromList(index) {
  selectedTracks.splice(index, 1);
  selectedUris.splice(index, 1);
  renderSelectedTracks();
  console.log("Selected URIs:", selectedUris);
}

let searchTimeout;

// 初期化処理を行う関数
async function initializeSearch() {
  const accessToken = await getAccessToken();
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const selectedTracksHeader = document.getElementById("selectedTracksHeader");
  const diagnosisButtonWrap = document.getElementById("diagnosisButtonWrap");

  // 初期状態で非表示にする
  selectedTracksHeader.style.display = "none";
  diagnosisButtonWrap.style.display = "none";

  searchInput.addEventListener("input", async (event) => {
    clearTimeout(searchTimeout); // 前回のタイマーをクリア

    const query = event.target.value;
    if (query.length > 0) {
      // 一定時間入力がない場合にAPIを呼び出す
      searchTimeout = setTimeout(async () => {
        const result = await searchSpotify(accessToken.access_token, query);
        displayResults(result.tracks.items);
      }, 500); //500ミリ秒待機してからAPI呼び出し
    } else {
      searchResults.innerHTML = "";
    }
  });

  // 検索結果を表示する関数
  function displayResults(tracks) {
    searchResults.innerHTML = "";
    tracks.forEach((track, index) => {
      const trackDiv = createTrackDiv(track, index);
      const addButton = createAddButton(track);
      trackDiv.appendChild(addButton);
      searchResults.appendChild(trackDiv);
    });

    // 選択された曲がある場合、初期状態で表示にする
    renderSelectedTracks();
    createSearchTitle();
  }

  // 検索結果のタイトルを生成する関数
  function createSearchTitle() {
    const searchTitleDiv = document.createElement("div");
    searchTitleDiv.classList.add("search_title");

    const titleText = ["タイトル", "アルバム", "アーティスト"];
    titleText.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      searchTitleDiv.appendChild(paragraph);
    });

    searchResults.insertBefore(searchTitleDiv, searchResults.firstChild);
  }

  // トラックを選択するボタンを作成する関数
  function createAddButton(track) {
    const addButton = document.createElement("button");
    addButton.textContent = "選択";
    addButton.classList.add("add-button");
    addButton.addEventListener("click", () => {
      addTrackToList(track);
    });

    // 既に選択されている曲ならボタンを無効にする todo
    if (selectedUris.includes(track.uri)) {
      addButton.disabled = true;
      addButton.textContent = "選択済み";
    }

    return addButton;
  }
}

function send() {
  console.log("実行");
  var csrftoken = getCookie("csrftoken");
  fetch("/js_py/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ selectedUris: selectedUris }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("jsから:", data.uris);
      console.log("pyから:", data.user_status);
      console.log("pyから:", data.recommended_music);
      console.log("pyから:", data.diagnosis_id);

      // status.htmlに遷移する
      window.location.href =
        "/status/?user_status=" +
        encodeURIComponent(JSON.stringify(data.user_status)) +
        "&diagnosis_id=" + data.diagnosis_id; 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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

// 初期化処理を実行
initializeSearch();
