// YouTube API Configuration
const API_KEY = 'AIzaSyD_64PJs5rFmAl_U1ON983bihNwMzy3nGc';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Search Music
function searchMusic() {
  const query = document.getElementById('search-query').value;
  
  fetch(`${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => displayResults(data.items))
    .catch(() => alert('Failed to load music. Please try again.'));
}

function displayResults(videos) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.default.url;
    const channel = video.snippet.channelTitle;

    resultsDiv.innerHTML += `
      <div class="song-card">
        <img src="${thumbnail}" alt="${title}">
        <div>
          <h3>${title}</h3>
          <p>${channel}</p>
        </div>
        <button onclick="playSong('${videoId}')">Play</button>
        <button onclick="saveToLibrary('${videoId}', '${title}', '${thumbnail}', '${channel}')">Save</button>
      </div>
    `;
  });
}

// Play Song
function playSong(videoId) {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// Save to Library
function saveToLibrary(videoId, title, thumbnail, channel) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  library.push({ videoId, title, thumbnail, channel });
  localStorage.setItem('library', JSON.stringify(library));
  alert('Song added to library!');
}

// Profile Management
function saveProfile() {
  const username = document.getElementById('username').value;
  const avatarFile = document.getElementById('avatar-upload').files[0];

  if (!username) return alert('Please enter your username.');

  const reader = new FileReader();
  reader.onload = e => {
    localStorage.setItem('username', username);
    localStorage.setItem('avatar', e.target.result);
    alert('Profile saved!');
    window.location.href = 'index.html';
  };
  
  if (avatarFile) reader.readAsDataURL(avatarFile);
}

// Friends Management
function addFriend() {
  const friendName = document.getElementById('friend-name').value;
  const friends = JSON.parse(localStorage.getItem('friends')) || [];
  friends.push(friendName);
  localStorage.setItem('friends', JSON.stringify(friends));
  alert('Friend added!');
}
