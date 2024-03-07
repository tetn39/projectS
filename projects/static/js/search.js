// アプリケーションの状態を管理するオブジェクト
const state = {
  selectedTracks: [],
  selectedUris: [],
  searchTimeout: null,
};

// Spotifyのアクセストークンを取得する非同期関数
async function getAccessToken() {
  const csrftoken = getCookie("csrftoken");
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

// Spotifyでトラックを検索する非同期関数
async function searchSpotify(access_token, query) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );
  return await response.json();
}

// 選択されたトラックをリストに追加する関数
function addTrackToList(track) {
  const isAlreadySelected = state.selectedUris.includes(track.uri.substr(14));

  if (!isAlreadySelected) {
    state.selectedTracks.push(track);
    state.selectedUris.push(track.uri.substr(14));
    renderSelectedTracks();
    console.log("Selected URIs:", state.selectedUris);
  } else {
    console.log("既に選択されています");
  }
}

// 選択されたトラックを表示する関数
function renderSelectedTracks() {
  renderSelectedTracksWithIndex();

  const selectedTracksHeader = getElementById("selectedTracksHeader");
  const diagnosisButtonWrap = getElementById("diagnosisButtonWrap");

  toggleElementDisplay(selectedTracksHeader, state.selectedTracks.length > 0);
  toggleElementDisplay(diagnosisButtonWrap, state.selectedTracks.length > 0);
}

// 選択されたトラックを配列番号と共に表示する関数
function renderSelectedTracksWithIndex() {
  const listContainer = getElementById("selectedTracks");
  listContainer.innerHTML = "";

  state.selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track, index);
    const indexLabel = createIndexLabel(index);
    trackDiv.insertBefore(indexLabel, trackDiv.firstChild);
    const deleteButton = createDeleteButton(index);

    trackDiv.addEventListener("click", () => {
      removeTrackFromList(index);
    });

    trackDiv.appendChild(deleteButton);
    listContainer.insertBefore(trackDiv, listContainer.firstChild);
  });
}

// 配列番号を表示するためのラベルを作成
function createIndexLabel(index) {
  const indexLabel = document.createElement("div");
  indexLabel.textContent = `#${index + 1}`;
  indexLabel.classList.add("index-label");
  return indexLabel;
}

// 選択されたトラックを表示するためのDIVを作成する関数
function createTrackDiv(track, index = 0) {
  const trackDiv = document.createElement("div");

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

  const trackNameDiv = document.createElement("div");
  trackNameDiv.textContent = track.name;
  trackNameDiv.classList.add("track-name");

  const albumNameDiv = document.createElement("div");
  albumNameDiv.textContent = track.album.name;
  albumNameDiv.classList.add("album-name");

  const artistNameDiv = document.createElement("div");
  artistNameDiv.textContent = track.artists[0].name;
  artistNameDiv.classList.add("artist-name");

  trackInfo.appendChild(trackNameDiv);
  trackInfo.appendChild(albumNameDiv);
  trackInfo.appendChild(artistNameDiv);
  trackDiv.appendChild(albumImage);
  trackDiv.appendChild(trackInfo);

  return trackDiv;
}

// 選択されたトラックを削除するボタンを作成する関数
function createDeleteButton(index) {
  const deleteButtonWrap = document.createElement("div");
  deleteButtonWrap.classList.add("delete-button-wrap");

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("delete-button");

  const deleteButtonIcon = document.createElement("span");
  deleteButtonIcon.classList.add("delete-icon");
  deleteButton.addEventListener("click", () => {
    removeTrackFromList(index);
  });

  deleteButton.appendChild(deleteButtonIcon);
  deleteButtonWrap.appendChild(deleteButton);

  return deleteButtonWrap;
}

// 選択されたトラックをリストから削除する関数
function removeTrackFromList(index) {
  state.selectedTracks.splice(index, 1);
  state.selectedUris.splice(index, 1);
  renderSelectedTracks();
  console.log("Selected URIs:", state.selectedUris);
}

// HTML要素を取得する関数
function getElementById(elementId) {
  return document.getElementById(elementId);
}

// HTML要素の表示を切り替える関数
function toggleElementDisplay(element, shouldDisplay) {
  element.style.display = shouldDisplay ? "block" : "none";
}

// 検索機能の初期化
async function initializeSearch() {
  const accessToken = await getAccessToken();
  const searchInput = getElementById("searchInput");

  const selectedTracksHeader = getElementById("selectedTracksHeader");
  const diagnosisButtonWrap = getElementById("diagnosisButtonWrap");

  toggleElementDisplay(selectedTracksHeader, false);
  toggleElementDisplay(diagnosisButtonWrap, false);

  searchInput.addEventListener("input", async (event) => {
    clearTimeout(state.searchTimeout);

    const query = event.target.value;
    if (query.length > 0) {
      state.searchTimeout = setTimeout(async () => {
        const result = await searchSpotify(accessToken.access_token, query);
        displayResults(result.tracks.items);
      }, 500);
    } else {
      getElementById("searchResults").innerHTML = "";
    }
  });
}

// 検索結果を表示する関数
function displayResults(tracks) {
  const searchResults = getElementById("searchResults");
  searchResults.innerHTML = "";

  tracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track, index);
    const addButton = createAddButton(track);

    trackDiv.addEventListener("click", () => {
      addTrackToList(track);
    });

    trackDiv.appendChild(addButton);
    searchResults.appendChild(trackDiv);
  });

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

  getElementById("searchResults").insertBefore(
    searchTitleDiv,
    searchResults.firstChild
  );
}

// トラックを選択するボタンを作成する関数
function createAddButton(track) {
  const addButtonWrap = document.createElement("div");
  addButtonWrap.classList.add("add-button-wrap");

  const addButton = document.createElement("span");
  addButton.classList.add("add-button");

  const addButtonIcon = document.createElement("span");

  addButton.appendChild(addButtonIcon);
  addButtonWrap.appendChild(addButton);

  return addButtonWrap;
}

// 選択されたトラックをサーバーに送信する関数
function send() {
  console.log("実行");
  const csrftoken = getCookie("csrftoken");

  fetch("/js_py/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ selectedUris: state.selectedUris }),
  })
    .then((response) => response.json())
    .then((data) => {
      // サーバーからのデータをログに出力
      console.log("jsから:", data.uris);
      console.log("pyから:", data.user_status);
      console.log("pyから:", data.recommended_music);
      console.log("pyから:", data.diagnosis_id);

      // status.htmlに遷移する
      window.location.href = "/status/?diagnosis_id=" + data.diagnosis_id;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Cookieから値を取得する関数
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// アプリケーションの初期化処理を実行
initializeSearch();
