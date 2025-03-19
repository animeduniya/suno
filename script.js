const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const audioPlayer = document.getElementById("audio");

// Audius API URL
const API_URL = "https://discoveryprovider.audius.co/v1/tracks/search?query=";

// Search for Songs
async function searchSongs() {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a song or artist name.");
    return;
  }
  
  try {
    resultsDiv.innerHTML = `<p>Loading songs...</p>`;
    const response = await fetch(API_URL + encodeURIComponent(query) + "&app_name=Suno");
    const data = await response.json();
    
    if (data.data.length === 0) {
      resultsDiv.innerHTML = `<p>No results found. Try another search.</p>`;
      return;
    }
    
    displaySongs(data.data);
  } catch (error) {
    resultsDiv.innerHTML = `<p>Failed to connect to Audius. Please try again later.</p>`;
    console.error("Error fetching songs:", error);
  }
}

// Display Song Results
function displaySongs(songs) {
  resultsDiv.innerHTML = ""; // Clear previous results
  
  songs.forEach(song => {
    const songCard = document.createElement("div");
    songCard.classList.add("song");

    const artworkUrl = song.artwork ? song.artwork['150x150'] : 'https://via.placeholder.com/150';
    songCard.innerHTML = `
      <img src="${artworkUrl}" alt="${song.title}" />
      <h3>${song.title}</h3>
      <p>Artist: ${song.user.name}</p>
      <button onclick="playSong('${song.stream_url}')">Play</button>
    `;

    resultsDiv.appendChild(songCard);
  });
}

// Play Song
function playSong(url) {
  if (!url) {
    alert("Song playback is not available.");
    return;
  }
  audioPlayer.src = url;
  audioPlayer.play();
}

// Event Listeners
searchBtn.addEventListener("click", searchSongs);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchSongs();
  }
});
