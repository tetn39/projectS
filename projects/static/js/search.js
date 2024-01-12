const client_id = "4f0d25f0cec241bf974d3f9f558eabb1";
const client_secret = "da7948150a4548b087e263bd6da8cf7b";
let selectedTracks = [];
let selectedUris = []; // 追加: URIを格納するための配列

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
  const isAlreadySelected = selectedUris.includes(track.uri);

  if (!isAlreadySelected) {
    selectedTracks.push(track);
    selectedUris.push(track.uri); // 追加: URIを配列に追加
    renderSelectedTracks();
    console.log("Selected URIs:", selectedUris);
  } else {
    console.log("既に選択されています");
  }
}

// 選択されたトラックを表示する関数
function renderSelectedTracks() {
  const listContainer = document.getElementById("selectedTracks");
  listContainer.innerHTML = "";

  selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track);
    const deleteButton = createDeleteButton(index);
    trackDiv.appendChild(deleteButton);
    listContainer.appendChild(trackDiv);
  });

  // 追加: PythonにURIの配列を送信
  // sendUrisToPython(selectedUris);
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
  selectedUris.splice(index, 1); // 修正: 対応するURIも削除
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

// 初期化処理を実行
initializeSearch();
