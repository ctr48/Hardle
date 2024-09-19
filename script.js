// Spotify API configuration
const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const redirectUri = 'http://localhost:8000'; // Update this with your actual redirect URI

// DOM elements
const loginButton = document.getElementById('login-button');
const loginContainer = document.getElementById('login-container');
const userProfile = document.getElementById('user-profile');
const userName = document.getElementById('user-name');
const userImage = document.getElementById('user-image');
const nowPlaying = document.getElementById('now-playing');
const trackName = document.getElementById('track-name');
const artistName = document.getElementById('artist-name');
const albumName = document.getElementById('album-name');
const albumCover = document.getElementById('album-cover');
const lyricsContainer = document.getElementById('lyrics-container');
const lyricsPreview = document.getElementById('lyrics-preview');

// Event listeners
loginButton.addEventListener('click', authenticateWithSpotify);

// Check if the user is already authenticated
window.onload = function() {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
        hideLoginButton();
        fetchUserProfile();
        fetchNowPlaying();
    }
};

// Spotify authentication
function authenticateWithSpotify() {
    const scopes = 'user-read-private user-read-email user-read-currently-playing';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    window.location.href = authUrl;
}

// Handle the redirect from Spotify
if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    if (accessToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        hideLoginButton();
        fetchUserProfile();
        fetchNowPlaying();
    }
}

// Hide login button and show user profile
function hideLoginButton() {
    loginContainer.classList.add('hidden');
    userProfile.classList.remove('hidden');
    nowPlaying.classList.remove('hidden');
}

// Fetch user profile from Spotify
function fetchUserProfile() {
    const accessToken = localStorage.getItem('spotify_access_token');
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        userName.textContent = data.display_name;
        if (data.images && data.images.length > 0) {
            userImage.src = data.images[0].url;
        }
    })
    .catch(error => console.error('Error fetching user profile:', error));
}

// Fetch currently playing track
function fetchNowPlaying() {
    const accessToken = localStorage.getItem('spotify_access_token');
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.item) {
            trackName.textContent = data.item.name;
            artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
            albumName.textContent = data.item.album.name;
            albumCover.src = data.item.album.images[0].url;
            fetchLyricsPreview(data.item.name, data.item.artists[0].name);
        } else {
            nowPlaying.innerHTML = '<p>No track currently playing</p>';
        }
    })
    .catch(error => console.error('Error fetching now playing:', error));
}

// Fetch lyrics preview (Note: This is a mock function as we can't provide full lyrics)
function fetchLyricsPreview(track, artist) {
    // In a real app, you would call a lyrics API here
    // For this example, we'll just show a mock preview
    lyricsContainer.classList.remove('hidden');
    lyricsPreview.textContent = `This is where a preview of the lyrics for "${track}" by ${artist} would appear. Due to copyright restrictions, we can't display full lyrics.`;
}

// Refresh now playing information every 30 seconds
setInterval(fetchNowPlaying, 30000);