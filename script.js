// Spotify API configuration
const clientId = 'd6321bff26594e628eae6954acd81e36'; // Make sure this is replaced with your actual Client ID
const redirectUri = 'https://ctr48.github.io/hardle/';


// DOM elements
const loginButton = document.getElementById('login-button');
console.log('Login button element:', loginButton); // Debug: Check if the button is found

// Event listeners
if (loginButton) {
    loginButton.addEventListener('click', authenticateWithSpotify);
    console.log('Click event listener added to login button');
} else {
    console.error('Login button not found in the DOM');
}

// Spotify authentication
function authenticateWithSpotify() {
    console.log('authenticateWithSpotify function called'); // Debug: Verify function is called
    const scopes = 'user-read-private user-read-email user-read-currently-playing';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    console.log('Authorization URL:', authUrl); // Debug: Log the complete auth URL
    console.log('Redirecting to Spotify login page...'); // Debug: Indicate redirect attempt
    window.location.href = authUrl;
}

// Rest of your existing code...

// Check if the user is already authenticated
window.onload = function() {
    console.log('Window loaded'); // Debug: Verify the onload function is executed
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    if (accessToken) {
        console.log('Access token found in URL'); // Debug: Check if token is extracted
        localStorage.setItem('spotify_access_token', accessToken);
        hideLoginButton();
        fetchUserProfile();
        fetchNowPlaying();
    } else if (localStorage.getItem('spotify_access_token')) {
        console.log('Access token found in localStorage'); // Debug: Check if token is in storage
        hideLoginButton();
        fetchUserProfile();
        fetchNowPlaying();
    } else {
        console.log('No access token found'); // Debug: Indicate no token scenario
    }
};

// ... (rest of your code remains unchanged)