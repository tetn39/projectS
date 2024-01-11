const client_id = "4f0d25f0cec241bf974d3f9f558eabb1";
const client_secret = "da7948150a4548b087e263bd6da8cf7b";
let selectedTracks = [];

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

function addTrackToList(track) {
  selectedTracks.push(track);
  renderSelectedTracks();
}

function renderSelectedTracks() {
  const listContainer = document.getElementById("selectedTracks");
  listContainer.innerHTML = "";

  selectedTracks.forEach((track, index) => {
    const trackDiv = createTrackDiv(track);
    const deleteButton = createDeleteButton(index);
    trackDiv.appendChild(deleteButton);
    listContainer.appendChild(trackDiv);
  });
}

function createTrackDiv(track) {
  const trackDiv = document.createElement("div");
  trackDiv.classList.add("track-div");

  const albumImage = document.createElement("img");
  albumImage.src = track.album.images[0].url;
  albumImage.alt = "Album Cover";
  albumImage.classList.add("album-image");

  const trackInfo = document.createElement("div");
  trackInfo.textContent =
    track.name + " / " + track.album.name + " / " + track.artists[0].name;
  trackInfo.classList.add("track-info");

  trackDiv.appendChild(albumImage);
  trackDiv.appendChild(trackInfo);

  return trackDiv;
}

function createDeleteButton(index) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    removeTrackFromList(index);
  });
  return deleteButton;
}

function removeTrackFromList(index) {
  selectedTracks.splice(index, 1);
  renderSelectedTracks();
}

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

  function displayResults(tracks) {
    searchResults.innerHTML = "";
    tracks.forEach((track) => {
      const trackDiv = createTrackDiv(track);
      const addButton = createAddButton(track);
      trackDiv.appendChild(addButton);
      searchResults.appendChild(trackDiv);
    });
  }

  function createAddButton(track) {
    const addButton = document.createElement("button");
    addButton.textContent = "選択";
    addButton.classList.add("add-button");
    addButton.addEventListener("click", () => {
      addTrackToList(track);
    });
    return addButton;
  }
}

initializeSearch();
