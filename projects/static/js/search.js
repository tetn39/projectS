const client_id = "4f0d25f0cec241bf974d3f9f558eabb1";
const client_secret = "da7948150a4548b087e263bd6da8cf7b";
let selectedTracks = [];
let selectedUris = [];

// SpotifyのAPIへのアクセストークンを取得する関数
async function getToken() {
  const credentials = btoa(`${client_id}:${client_secret}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
  });
  return await response.json();
}

// Spotifyでトラックを検索する関数
async function searchSpotify(access_token, query) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
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
}

// 選択されたトラックを配列番号と共に表示する関数
function renderSelectedTracksWithIndex() {
  const listContainer = document.getElementById("selectedTracks");
  listContainer.innerHTML = "";

  selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track);
    const indexLabel = createIndexLabel(index);
    trackDiv.insertBefore(indexLabel, trackDiv.firstChild); // 配列番号を画像の左に挿入
    const deleteButton = createDeleteButton(index);
    trackDiv.appendChild(deleteButton);
    listContainer.appendChild(trackDiv);
  });
}

// 新しい関数: 配列番号を表示するためのラベルを作成
function createIndexLabel(index) {
  const indexLabel = document.createElement("div");
  indexLabel.textContent = `#${index + 1}`; // 配列番号は1から始まるようにするため +1
  indexLabel.classList.add("index-label");
  return indexLabel;
}

// 選択されたトラックを表示するためのDIVを作成する関数
function createTrackDiv(track) {
  const trackDiv = document.createElement("div");
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

// 初期化処理を行う関数
async function initializeSearch() {
  const response = await getToken();
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      const result = await searchSpotify(response.access_token, query);
      displayResults(result.tracks.items);
    } else {
      searchResults.innerHTML = "";
    }
  });

  // 検索結果を表示する関数
  function displayResults(tracks) {
    searchResults.innerHTML = "";
    tracks.forEach((track) => {
      const trackDiv = createTrackDiv(track);
      const addButton = createAddButton(track);
      trackDiv.appendChild(addButton);
      searchResults.appendChild(trackDiv);
    });
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
      console.log("Success:", data);
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
