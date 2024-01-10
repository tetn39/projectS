const client_id = "4f0d25f0cec241bf974d3f9f558eabb1";
const client_secret = "da7948150a4548b087e263bd6da8cf7b";
let selectedTracks = [];

// Spotifyのアクセストークンを取得する
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

// Spotifyでトラックを検索する
async function searchSpotify(access_token, query) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );
  return await response.json();
}

// 選択したトラックをリストに追加する
function addTrackToList(track) {
  selectedTracks.push(track);
  renderSelectedTracks(); // 選択されたトラックを再描画
}

// 選択したトラックのリストをHTMLで表示する
function renderSelectedTracks() {
  const listContainer = document.getElementById("selectedTracks");
  listContainer.innerHTML = "";

  // 選択されたトラックを表示
  selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track); // トラック表示の作成
    const deleteButton = createDeleteButton(index); // 削除ボタンの作成
    trackDiv.appendChild(deleteButton);
    listContainer.appendChild(trackDiv);
  });
}

// トラック表示を作成する
function createTrackDiv(track) {
  const trackDiv = document.createElement("div");
  trackDiv.textContent = track.name;
  console.log(track.artists);
  return trackDiv;
}

// 削除ボタンを作成する
function createDeleteButton(index) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", () => {
    removeTrackFromList(index); // リストからトラックを削除
  });
  return deleteButton;
}

// 選択したトラックをリストから削除する
function removeTrackFromList(index) {
  selectedTracks.splice(index, 1);
  renderSelectedTracks(); // 削除後、トラックを再描画
}

// 検索の初期化
async function initializeSearch() {
  // アクセストークンを取得
  const response = await getToken();
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // 検索入力時のイベントリスナーを追加
  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      const result = await searchSpotify(response.access_token, query);
      displayResults(result.tracks.items); // 検索結果を表示
    } else {
      searchResults.innerHTML = ""; // 検索欄が空の場合は結果をクリア
    }
  });

  // 検索結果を表示する
  function displayResults(tracks) {
    searchResults.innerHTML = "";
    tracks.forEach((track) => {
      const trackDiv = createTrackDiv(track); // トラック表示の作成
      const addButton = createAddButton(track); // 追加ボタンの作成
      trackDiv.appendChild(addButton);
      searchResults.appendChild(trackDiv);
    });
  }

  // 追加ボタンを作成する
  function createAddButton(track) {
    const addButton = document.createElement("button");
    addButton.textContent = "選択";
    addButton.addEventListener("click", () => {
      addTrackToList(track); // 選択したトラックをリストに追加
    });
    return addButton;
  }
}

initializeSearch(); // 検索の初期化
