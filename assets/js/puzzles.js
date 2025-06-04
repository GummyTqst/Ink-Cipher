// ======== Global State for Puzzle Completion ========
let isCipherSolved = false;
let isAnagramSolved = false;

// ======== Symbol Cipher Puzzle ========
const cipherSymbols = ['☀️', '♦️', '🌙', '💎', '💚'];
let cipherSymbolMapping = {};

const cipherSymbolsDisplay = document.getElementById('cipherSymbolsDisplay');
const cipherLongInput = document.getElementById('cipherLongInput');
const cipherFeedback = document.getElementById('cipherFeedback');
const cipherAlphabetGrid = document.getElementById('cipherAlphabetGrid');

function generateCipherPuzzle() {
    isCipherSolved = false; // Reset status
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const shuffledAlphabet = [...alphabet].sort(() => Math.random() - 0.5);
    cipherSymbolMapping = {};

    // Display symbols for the input row
    if (cipherSymbolsDisplay) {
        cipherSymbolsDisplay.innerHTML = ''; // Clear previous symbols
        cipherSymbols.forEach(s => {
            const span = document.createElement('span');
            span.className = 'symbol-input'; // Use existing class if appropriate
            span.textContent = s;
            cipherSymbolsDisplay.appendChild(span);
        });
    }
    
    for (let i = 0; i < cipherSymbols.length; i++) {
        cipherSymbolMapping[cipherSymbols[i]] = shuffledAlphabet[i];
    }

    if (cipherAlphabetGrid) {
        cipherAlphabetGrid.innerHTML = '';
        alphabet.forEach((letter) => {
            const cell = document.createElement('div');
            cell.className = 'alphabet-cell';
            const symbolKey = Object.keys(cipherSymbolMapping).find(key => cipherSymbolMapping[key] === letter);
            cell.textContent = symbolKey ? symbolKey : letter;
            cipherAlphabetGrid.appendChild(cell);
        });
    }

    if (cipherLongInput) {
        cipherLongInput.value = '';
        cipherLongInput.style.borderColor = '#502C07';
    }
    if (cipherFeedback) {
        cipherFeedback.textContent = '';
        cipherFeedback.className = 'feedback';
    }
    checkOverallCompletion(); // Update continue button status
}

function checkCipherAnswer() {
    if (!cipherLongInput || !cipherFeedback) return;

    const userGuesses = cipherLongInput.value.toUpperCase().split('');
    
    if (userGuesses.length !== cipherSymbols.length) {
        cipherFeedback.textContent = `Please enter exactly ${cipherSymbols.length} letters!`;
        cipherFeedback.className = 'feedback incorrect';
        cipherLongInput.style.borderColor = '#FFB6C1';
        isCipherSolved = false;
        checkOverallCompletion();
        return;
    }

    let correctCount = 0;
    for (let i = 0; i < cipherSymbols.length; i++) {
        if (userGuesses[i] === cipherSymbolMapping[cipherSymbols[i]]) {
            correctCount++;
        }
    }

    if (correctCount === cipherSymbols.length) {
        cipherLongInput.style.borderColor = '#90EE90';
        cipherFeedback.textContent = 'Congratulations! You solved the cipher!';
        cipherFeedback.className = 'feedback correct';
        isCipherSolved = true;
    } else {
        cipherLongInput.style.borderColor = '#FFB6C1';
        cipherFeedback.textContent = `${correctCount}/${cipherSymbols.length} correct. Keep trying!`;
        cipherFeedback.className = 'feedback incorrect';
        isCipherSolved = false;
    }
    checkOverallCompletion();
}

if (cipherLongInput) {
    cipherLongInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
}

// ======== Anagram Puzzle ========
// DOm elements for Anagram Puzzle
const anagramClueLettersDiv = document.getElementById('anagramClueLetters');
const anagramGrid = document.getElementById('anagramGrid');
const anagramFeedback = document.getElementById('anagramFeedback');

const anagramWordCache = {};
let currentAnagramSolutionWord = ""; // To store the solution word for the current anagram

function getAnagramInputs() {
    return Array.from(anagramGrid.querySelectorAll("input"));
}

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

async function isValidAnagramWord(word) {
    if (anagramWordCache[word.toUpperCase()]) return anagramWordCache[word.toUpperCase()];
    try {
        if (word.length !== 5) return false; // Must be 5 letters
        // Check if word is ANY valid English word from a API
        const res = await fetch (`https://api.datamuse.com/words?sp=${word}&max=1`);
        const data = await res.json();
        const valid = data.length > 0 && data[0].word.toUpperCase() === word.toUpperCase();
        anagramWordCache[word.toUpperCase()] = valid;
        return valid;

    } catch (err) {
        console.error("API error (isValidAnagramWord):", err);
        return false;
    }
}

async function validateAnagramRows() {
    if (!anagramGrid) return;
    const inputs = getAnagramInputs();
    let anyRowIsValid = false;
    isAnagramSolved = false; // Reset before checking

    for (let row = 0; row < 5; row++) { // Assuming 5 rows for anagram
        const rowInputs = inputs.slice(row * 5, row * 5 + 5);
        if(rowInputs.length < 5) continue; // Not enough inputs for a full row

        const word = rowInputs.map(input => input.value.toUpperCase()).join("");
        let rowIsValid = false;

        if (word.length === 5) {
            rowIsValid = await isValidAnagramWord(word);
            if (rowIsValid) {
                anyRowIsValid = true;
                if (word.toUpperCase() === currentAnagramSolutionWord) {
                    isAnagramSolved = true;
                }
            }
        }
        rowInputs.forEach(input => {
            input.classList.toggle("valid-word", rowIsValid);
        });
    }
    if (anagramFeedback) {
        if (isAnagramSolved) {
            anagramFeedback.textContent = "Correct anagram found!";
            anagramFeedback.className = "feedback correct";
        } else if (anyRowIsValid) {
            anagramFeedback.textContent = "You found a valid word! Can you find the main one?";
            anagramFeedback.className = "feedback"; // Neutral or slightly positive
        } else {
            anagramFeedback.textContent = ""; // Clear if no valid words yet
        }
    }
    checkOverallCompletion();
}

function renderAnagramGrid() {
    if (!anagramGrid) return;
    isAnagramSolved = false; // Reset status
    anagramGrid.innerHTML = '';
    for (let i = 0; i < 25; i++) { // 5x5 grid
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.autocomplete = "off"; // Prevent browser suggestions

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();
            // Basic auto-tab to next input
            if (e.target.value.length === 1) {
                const currentInputIndex = getAnagramInputs().indexOf(e.target);
                if (currentInputIndex < 24 && currentInputIndex % 5 < 4) { // Not last input in row or grid
                    getAnagramInputs()[currentInputIndex + 1].focus();
                }
            }
            validateAnagramRows();
        });
        // Handle backspace to go to previous input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                const currentInputIndex = getAnagramInputs().indexOf(e.target);
                if (currentInputIndex > 0) {
                    getAnagramInputs()[currentInputIndex - 1].focus();
                }
            }
        });
        anagramGrid.appendChild(input);
    }
    checkOverallCompletion(); // Update continue button status
}

async function generateAnagramPuzzle() {
    if (!anagramClueLettersDiv) return;
    isAnagramSolved = false; // Reset status
    try {
        const res = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        const data = await res.json();
        currentAnagramSolutionWord = data[0].toUpperCase(); // Store the solution
        const shuffled = shuffleWord(currentAnagramSolutionWord);

        anagramClueLettersDiv.textContent = shuffled.split('').join(' ');
        // Pre-cache the solution word as valid to avoid an API call if they type it directly
        anagramWordCache[currentAnagramSolutionWord] = true; 
        renderAnagramGrid();
        if(anagramFeedback) anagramFeedback.textContent = "";
    } catch (err) {
        console.error("Failed to get random word for anagram:", err);
        anagramClueLettersDiv.textContent = "ERROR";
    }
    checkOverallCompletion(); // Update continue button status
}


// ======== Global Controls ========
const globalContinueBtn = document.getElementById('globalContinueBtn');
const globalNewPuzzlesBtn = document.getElementById('globalNewPuzzlesBtn');

function checkOverallCompletion() {
    if (globalContinueBtn) {
        if (isCipherSolved && isAnagramSolved) {
            globalContinueBtn.disabled = false;
            globalContinueBtn.classList.add('ready-to-continue'); 
        } else {
            globalContinueBtn.disabled = true;
            globalContinueBtn.classList.remove('ready-to-continue');
        }
    }
}

function initializeBothPuzzles() {
    generateCipherPuzzle();
    generateAnagramPuzzle(); // This calls renderAnagramGrid and checkOverallCompletion
}

if (globalContinueBtn) {
    globalContinueBtn.addEventListener("click", () => {
        if (isCipherSolved && isAnagramSolved) {
            alert("Congratulations! Both puzzles solved! Proceeding...");
            window.location.href = "/collection.html";
        } else {
            alert("Please solve both puzzles to continue.");
        }
    });
}

if (globalNewPuzzlesBtn) {
    globalNewPuzzlesBtn.addEventListener("click", initializeBothPuzzles);
}

// ======== Initialize Puzzles on Load ========
document.addEventListener('DOMContentLoaded', () => {
    initializeBothPuzzles();
});