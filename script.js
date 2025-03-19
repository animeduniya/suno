const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const audioPlayer = document.getElementById('audio');

// Search Music
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term!');
    return;
  }

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
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
        <img src="${song.album.cover_medium}" alt="Cover">
        <div class="info">
          <h3>${song.title}</h3>
          <p>${song.artist.name}</p>
        </div>
        <button onclick="playSong('${song.preview}')">Play</button>
      `;
      resultsDiv.appendChild(songCard);
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    resultsDiv.innerHTML = '<p>Failed to fetch music. Please try again later.</p>';
  }
});

// Play Music
function playSong(url) {
  audioPlayer.src = url;
  audioPlayer.play();
}
