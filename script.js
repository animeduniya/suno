// Get a working Audius node
async function getAudiusNode() {
  try {
    const response = await fetch('https://api.audius.co');
    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error('Failed to fetch Audius node:', error);
    return null;
  }
}

// Search for music using the Audius API
async function searchMusic(query) {
  const node = await getAudiusNode();
  if (!node) {
    document.getElementById('results').innerHTML = '<p>Failed to connect to Audius. Please try again later.</p>';
    return;
  }

  try {
    const response = await fetch(`${node}/v1/tracks/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!data || !data.data || data.data.length === 0) {
      resultsDiv.innerHTML = '<p>No songs found!</p>';
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
        <button onclick="addToLibrary('${song.id}', '${song.title}', '${song.user.name}', '${song.artwork['480x480'] || 'default-cover.jpg'}')">Add to Library</button>
      `;
      resultsDiv.appendChild(songCard);
    });
  } catch (error) {
    console.error('Error fetching music:', error);
    document.getElementById('results').innerHTML = '<p>Failed to load music. Please try again.</p>';
  }
}

// Play song
function playSong(url) {
  const audioPlayer = document.getElementById('audio');
  audioPlayer.src = url;
  audioPlayer.play();
}

// Add to library (stored in localStorage)
function addToLibrary(id, title, artist, cover) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  library.push({ id, title, artist, cover });
  localStorage.setItem('library', JSON.stringify(library));
  alert(`${title} added to your library!`);
}

// Search button click event
document.getElementById('searchBtn').onclick = () => {
  const query = document.getElementById('search').value.trim();
  if (query) {
    searchMusic(query);
  } else {
    alert('Please enter a song or artist name.');
  }
};
