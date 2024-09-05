const WORD_LENGTH = 5;
const MAX_GUESSES = 5;

let targetWord = '';
let currentGuess = '';
let guessCount = 0;
let gameResults = [];

const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const resultsScreen = document.getElementById('results-screen');
const resultMessage = document.getElementById('result-message');
const resultGrid = document.getElementById('result-grid');
const shareButton = document.getElementById('share-button');
const playAgainButton = document.getElementById('play-again-button');

// Initialize the game
function initGame() {
    createGameBoard();
    createKeyboard();
    selectTargetWord();
    window.addEventListener('keydown', handleKeyPress);
    shareButton.addEventListener('click', shareResults);
    playAgainButton.addEventListener('click', resetGame);
}

// Create the game board
function createGameBoard() {
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        gameBoard.appendChild(row);
    }
}

// Create the keyboard
function createKeyboard() {
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ];

    rows.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        row.forEach(key => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = key;
            buttonElement.className = 'key';
            if (key === 'Enter' || key === 'Backspace') {
                buttonElement.classList.add('wide');
            }
            buttonElement.addEventListener('click', () => handleKeyPress({ key }));
            keyboardRow.appendChild(buttonElement);
        });
        keyboard.appendChild(keyboardRow);
    });
}

// Select a random 5-letter word
function selectTargetWord() {
    const words = ["apple", "beach", "chair", "dance", "eagle", "flame", "grape", "horse", "ivory", "jelly", "knife", "lemon", "mango", "night", "ocean", "piano", "queen", "river", "storm", "tiger", "umbra", "violin", "witch", "xylophone", "yacht", "zebra"];
    targetWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
}

// Handle key press events
function handleKeyPress(e) {
    const key = e.key.toUpperCase();
    if (key === 'ENTER' && currentGuess.length === WORD_LENGTH) {
        submitGuess();
    } else if (key === 'BACKSPACE' && currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateGameBoard();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        currentGuess += key;
        updateGameBoard();
    }
}

// Submit the current guess
function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) return;

    const row = gameBoard.children[guessCount];
    const tiles = row.children;
    const result = evaluateGuess(currentGuess);

    for (let i = 0; i < WORD_LENGTH; i++) {
        tiles[i].textContent = currentGuess[i];
        tiles[i].classList.add(result[i]);
        updateKeyboardColor(currentGuess[i], result[i]);
    }

    gameResults.push(result);

    if (currentGuess === targetWord) {
        showResultsScreen(true);
        return;
    }

    guessCount++;
    if (guessCount === MAX_GUESSES) {
        showResultsScreen(false);
        return;
    }

    currentGuess = '';
}

// Evaluate the current guess
function evaluateGuess(guess) {
    const result = Array(WORD_LENGTH).fill('absent');
    const letterCounts = {};

    // Count the occurrences of each letter in the target word
    for (let letter of targetWord) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    // First pass: mark correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === targetWord[i]) {
            result[i] = 'correct';
            letterCounts[guess[i]]--;
        }
    }

    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] !== 'correct' && letterCounts[guess[i]] > 0) {
            result[i] = 'present';
            letterCounts[guess[i]]--;
        }
    }

    return result;
}

// Update the game board
function updateGameBoard() {
    const row = gameBoard.children[guessCount];
    const tiles = row.children;

    for (let i = 0; i < WORD_LENGTH; i++) {
        tiles[i].textContent = i < currentGuess.length ? currentGuess[i] : '';
    }
}

// Update keyboard key colors
function updateKeyboardColor(letter, result) {
    const key = document.querySelector(`.key:not(.wide):not(.colored)[textContent="${letter}"]`);
    if (key) {
        key.classList.add(result);
        key.classList.add('colored');
    }
}

// Show the results screen
function showResultsScreen(won) {
    resultsScreen.classList.remove('hidden');
    resultMessage.textContent = won ? `Congratulations! You guessed the word!` : `Game over! Better luck next time.`;
    
    resultGrid.innerHTML = '';
    gameResults.forEach(result => {
        const row = document.createElement('div');
        row.className = 'row';
        result.forEach(tileResult => {
            const tile = document.createElement('div');
            tile.className = `tile ${tileResult}`;
            row.appendChild(tile);
        });
        resultGrid.appendChild(row);
    });
}

// Share results
function shareResults() {
    let resultText = `Hardle Game Results:\n`;
    gameResults.forEach(result => {
        resultText += result.map(r => r === 'correct' ? '🟩' : r === 'present' ? '🟨' : '⬜').join('') + '\n';
    });

    if (navigator.share) {
        navigator.share({
            title: 'Hardle Game Results',
            text: resultText
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const textArea = document.createElement('textarea');
        textArea.value = resultText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Results copied to clipboard!');
    }
}

// Reset the game
function resetGame() {
    guessCount = 0;
    currentGuess = '';
    gameResults = [];
    gameBoard.innerHTML = '';
    keyboard.innerHTML = '';
    resultsScreen.classList.add('hidden');
    initGame();
}

// Initialize the game
initGame();