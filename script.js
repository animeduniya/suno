
let player;
let isPlaying = false;

// Initialize YouTube API
function onYouTubeIframeAPIReady() {}

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// Page Switching
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Search and Play Music
function searchSong() {
  const query = document.getElementById("searchInput").value;
  const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with your actual API Key
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items.length === 0) {
        alert("No results found.");
        return;
      }

      const videoId = data.items[0].id.videoId;
      const videoTitle = data.items[0].snippet.title;
      const channelTitle = data.items[0].snippet.channelTitle;
      const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;

      document.getElementById("songResults").innerHTML = `
        <img src="${thumbnailUrl}" alt="Thumbnail" />
        <p><strong>${videoTitle}</strong> by ${channelTitle}</p>
      `;

      if (player) {
        player.loadVideoById(videoId);
      } else {
        player = new YT.Player('player', {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
          },
          events: {
            'onReady': onPlayerReady,
          }
        });
      }
    })
    .catch(error => {
      console.error("Error fetching music:", error);
      alert("Failed to load music. Please try again.");
    });
}

// Player Controls
function onPlayerReady(event) {
  event.target.playVideo();
  isPlaying = true;
  document.getElementById("playPause").innerText = "Pause";
}

function togglePlayPause() {
  if (!player) return;

  if (isPlaying) {
    player.pauseVideo();
    document.getElementById("playPause").innerText = "Play";
  } else {
    player.playVideo();
    document.getElementById("playPause").innerText = "Pause";
  }
  isPlaying = !isPlaying;
}
