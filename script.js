const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const audioPlayer = document.getElementById('audio');

const audiusAPI = "https://api.audius.co";

// Search music using Audius API
async function searchMusic(query) {
  try {
    const response = await fetch(`${audiusAPI}/v1/tracks/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    resultsDiv.innerHTML = '';

    if (data.data.length === 0) {
      resultsDiv.innerHTML = '<p>No results found!</p>';
      return;
    }

    data.data.forEach(song => {
      const songCard = document.createElement('div');
      songCard.classList.add('song');
      songCard.innerHTML = `
        <img src="${song.artwork['480x480'] || 'default-cover.jpg'}" alt="Cover">
        <h3>${song.title}</h3>
        <p>By ${song.user.name}</p>
        <button onclick="playSong('${song.stream_url}')">Play</button>
      `;
      resultsDiv.appendChild(songCard);
    });
  } catch (error) {
    console.error('Error fetching music:', error);
    resultsDiv.innerHTML = '<p>Failed to load music. Please try again.</p>';
  }
}

// Play Music
function playSong(url) {
  audioPlayer.src = url;
  audioPlayer.play();
}

// Event Listener
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMusic(query);
  } else {
    alert('Please enter a search term!');
  }
});
