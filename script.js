// Firebase configuration (replace with your own)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const visualizer = document.getElementById('visualizer');
const playlist = document.getElementById('playlist');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');

let currentAudioContext;
let currentAnalyser;

// Example Free Music Archive API (replace with a more robust API)
const freeMusicArchiveApiUrl = 'https://freemusicarchive.org/api/get/tracks.json?api_key=YOUR_FMA_API_KEY&limit=20&track_title=';

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    fetch(`<span class="math-inline">\{freeMusicArchiveApiUrl\}</span>{searchTerm}`)
        .then(response => response.json())
        .then(data => {
            searchResults.innerHTML = '';
            data.dataset.forEach(track => {
                const li = document.createElement('li');
                li.textContent = `${track.track_title} - ${track.artist_name}`;
                li.addEventListener('click', () => playTrack(track));
                searchResults.appendChild(li);
            });
        });
});

function playTrack(track) {
    audioPlayer.src = track.track_file;
    songTitle.textContent = track.track_title;
    artistName.textContent = track.artist_name;
    audioPlayer.play();
    visualizeAudio();
}

function visualizeAudio() {
    if (currentAudioContext) {
        currentAudioContext.close();
    }
    currentAudioContext = new AudioContext();
    const source = currentAudioContext.createMediaElementSource(audioPlayer);
    currentAnalyser = currentAudioContext.createAnalyser();
    source.connect(currentAnalyser);
    currentAnalyser.connect(currentAudioContext.destination);

    const bufferLength = currentAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        currentAnalyser.getByteFrequencyData(dataArray);

        // Visualize dataArray (e.g., draw bars in the visualizer div)
        // Example:
        visualizer.innerHTML = '';
        for (let i = 0; i < bufferLength; i++) {
            const bar = document.createElement('div');
            bar.style.width = '2px';
            bar.style.height = `${dataArray[i]}px`;
            bar.style.backgroundColor = `rgb(${dataArray[i]}, ${100}, ${200})`;
            visualizer.appendChild(bar);
        }
    }

    draw();
}

//firebase authentication.
auth.onAuthStateChanged((user) => {
    if (user) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
});
