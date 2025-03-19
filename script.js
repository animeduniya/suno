async function getAudiusNode() {
  const response = await fetch('https://api.audius.co');
  const data = await response.json();
  return data.data[0];
}

async function searchMusic(query) {
  const node = await getAudiusNode();
  if (!node) return alert('Failed to connect to Audius');

  const response = await fetch(`${node}/v1/tracks/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  data.data.forEach(song => {
    const songCard = document.createElement('div');
    songCard.classList.add('song');
    songCard.innerHTML = `
      <img src="${song.artwork['480x480'] || 'default-cover.jpg'}" alt="Cover">
      <h3>${song.title}</h3>
      <p>By ${song.user.name}</p>
      <button onclick="playSong('${song.stream_url}')">Play</button>
      <button onclick="addToLibrary('${song.title}')">Add to Library</button>
    `;
    resultsDiv.appendChild(songCard);
  });
}

function playSong(url) {
  const audioPlayer = document.getElementById('audio');
  audioPlayer.src = url;
  audioPlayer.play();
}

function addToLibrary(song) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  library.push(song);
  localStorage.setItem('library', JSON.stringify(library));
  alert(`${song} added to your library!`);
}
