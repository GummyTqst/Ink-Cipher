// ======== Global Variables & DOM Elements ========
const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');
const modal = document.getElementById('puzzleModal');
const puzzleTitleElement = document.getElementById('puzzleTitle');
const puzzleCounterElement = document.getElementById('puzzleCounter');
const progressFillElement = document.getElementById('progressFill');
const puzzleContentElement = document.getElementById('puzzleContent');

let allPuzzlesData = [];
let currentPuzzleData = {};
let currentBookIndex = 0;
let bookProgress = {}; // Stored in localStorage
let selectedColorSequence = []; // For Color Puzzle
let memoryGameState = {}; // For Memory Puzzle

// ======== Utility & Helper Functions ========

function displayFeedback(feedbackEl, message, isCorrect, isHint = false) {
    if (!feedbackEl) return;
    let cssClass = '';
    if (isHint) {
        cssClass = 'hint-message'; // You'll need to style this class in CSS
    } else {
        cssClass = isCorrect ? 'correct' : 'incorrect';
    }
    feedbackEl.innerHTML = `<p class="${cssClass}">${message}</p>`;
}


function handleSimpleAnswerCheck(isCorrect, feedbackEl, successMsg, errorMsg) {
    displayFeedback(feedbackEl, isCorrect ? successMsg : errorMsg, isCorrect);
    if (isCorrect) {
        setTimeout(nextPuzzle, 1500);
    }
}

function loadBookProgress() {
    const saved = localStorage.getItem('bookProgress');
    bookProgress = saved ? JSON.parse(saved) : {};
}

function saveBookProgress() {
    localStorage.setItem('bookProgress', JSON.stringify(bookProgress));
}

async function fetchAllPuzzles() {
    if (allPuzzlesData.length === 0) {
        try {
            const res = await fetch('assets/json/puzzles.json');
            allPuzzlesData = await res.json();
        } catch (error) {
            console.error('Error loading all puzzles:', error);
            allPuzzlesData = [];
        }
    }
    return allPuzzlesData;
}

function isLightColor(color) {
    const lightColors = ['yellow', 'lime', 'pink', 'cyan', 'orange', 'white'];
    return lightColors.includes(color.toLowerCase());
}

// ======== Burger Menu ========
if (burgerMenu && mainNav) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}

// ======== Hint Functionality ========
function showHint() {
    const feedbackEl = document.getElementById('puzzleFeedback'); // Or a dedicated hint display element
    const hintButton = document.getElementById('hintButton');

    if (!currentPuzzleData || !feedbackEl) return;

    if (currentPuzzleData.hint) {
        displayFeedback(feedbackEl, `Hint: ${currentPuzzleData.hint}`, false, true); // Display as a hint
        if (hintButton) {
            hintButton.disabled = true; // Disable after use for this puzzle instance
            hintButton.textContent = "Hint Used";
        }
    } else {
        displayFeedback(feedbackEl, "No hint available for this puzzle.", false, true);
        if (hintButton) {
            hintButton.disabled = true;
            hintButton.textContent = "No Hint";
        }
    }
}


// ======== Puzzle Display Functions ========

function showMathPuzzle(container, puzzleData) {
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="math-puzzle">
                <h3>${puzzleData.title || 'Math Challenge'}</h3>
                <p class="question">${puzzleData.question}</p>
                <input type="number" class="answer-input" id="mathAnswer" placeholder="Enter your answer">
                <button class="submit-btn" onclick="checkMathAnswer(${puzzleData.answer})">Submit</button>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;
}

function showWordPuzzle(container, puzzleData) {
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="word-puzzle">
                <h3>${puzzleData.title || 'Word Puzzle'}</h3>
                <div class="riddle-box"><p class="riddle-text">${puzzleData.clue}</p></div>
                <input type="text" class="answer-input" id="wordAnswer" placeholder="Enter your answer">
                <button class="submit-btn" onclick="checkWordAnswer('${puzzleData.answer}')">Submit</button>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;
}

function showLogicPuzzle(container, puzzleData) {
    const optionsHTML = puzzleData.options.map((option, index) =>
        `<label class="option-label">
            <input type="radio" name="logicAnswer" value="${index}"> <span>${option}</span>
        </label>`
    ).join('');
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="logic-puzzle">
                <h3>${puzzleData.title || 'Logic Puzzle'}</h3>
                <p class="question">${puzzleData.question}</p>
                <div class="options">${optionsHTML}</div>
                <button class="submit-btn" onclick="checkLogicAnswer(${puzzleData.answer})">Submit</button>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;
}

function showPatternPuzzle(container, puzzleData) {
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="pattern-puzzle">
                <h3>${puzzleData.title || 'Pattern Recognition'}</h3>
                <p class="question">What's the next number in this sequence?</p>
                <div class="pattern-display">${puzzleData.pattern.join(', ')}, ?</div>
                <input type="number" class="answer-input" id="patternAnswer" placeholder="Enter next number">
                <button class="submit-btn" onclick="checkPatternAnswer()">Submit</button>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;
}

function showColorPuzzle(container, puzzleData) {
    window.currentColorSequence = puzzleData.sequence;
    selectedColorSequence = [];
    const availableColors = ["red", "blue", "green", "yellow", "purple", "orange"];
    const colorDisplay = puzzleData.sequence.map(color => `<div class="color-box" style="background-color: ${color};"></div>`).join('');
    const colorButtonsHTML = availableColors.map(color => `<button class="color-btn" data-color="${color}" style="background-color: ${color};" title="${color}"></button>`).join('');

    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="color-puzzle">
                <h3>${puzzleData.title || 'Color Memory'}</h3>
                <p class="question">Memorize the sequence (it will disappear):</p>
                <div class="color-sequence" id="colorSequenceToMemorize">${colorDisplay}</div>
                <p>Recreate it:</p>
                <div class="color-buttons">${colorButtonsHTML}</div>
                <div class="selected-colors" id="selectedColorsDisplay"></div>
                <button class="submit-btn" onclick="checkColorAnswer()">Submit</button>
                <button class="reset-btn" onclick="resetColorSelection()">Reset Selection</button>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;

    setTimeout(() => { document.getElementById('colorSequenceToMemorize')?.remove(); }, 5000);
    container.querySelectorAll('.color-btn').forEach(btn => btn.addEventListener('click', () => addColorToSequence(btn.dataset.color)));
}

function showMemoryPuzzle(container, puzzleData) {
    const shuffledCards = [...puzzleData.cards, ...puzzleData.cards].sort(() => 0.5 - Math.random());
    window.currentMemoryGameCardsData = shuffledCards;

    const cardsHTML = shuffledCards.map((symbol, index) =>
        `<div class="memory-card" data-symbol="${symbol}" data-index="${index}">
            <div class="card-front">?</div>
            <div class="card-back">${symbol}</div>
        </div>`
    ).join('');

    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div class="memory-puzzle">
                <h3>${puzzleData.title || 'Memory Game'}</h3>
                <p class="question">Find all matching pairs!</p>
                <div class="memory-grid">${cardsHTML}</div>
                <div class="memory-stats">
                    Pairs: <span id="pairsFound">0</span>/${puzzleData.cards.length} | Attempts: <span id="attempts">0</span>
                </div>
                <button class="hint-btn" id="hintButton" onclick="showHint()">Show Hint</button>
                <div class="feedback" id="puzzleFeedback"></div>
            </div>
        </div>`;
    setTimeout(() => initMemoryGame(shuffledCards), 100);
}

// ======== Puzzle Answer Checking Functions ========

function checkMathAnswer(correctAnswer) {
    const userAnswer = parseInt(document.getElementById('mathAnswer')?.value);
    const feedbackEl = document.getElementById('puzzleFeedback');
    if (!feedbackEl) return;
    handleSimpleAnswerCheck(userAnswer === correctAnswer, feedbackEl, "Correct! Well done!", "Incorrect. Try again!");
}

function checkWordAnswer(correctAnswer) {
    const userAnswer = document.getElementById('wordAnswer')?.value.toLowerCase().trim();
    const feedbackEl = document.getElementById('puzzleFeedback');
    if (!feedbackEl) return;
    handleSimpleAnswerCheck(userAnswer === correctAnswer.toLowerCase(), feedbackEl, "Correct! Great thinking!", "Incorrect. Try again!");
}

function checkLogicAnswer(correctAnswer) {
    const selectedOption = document.querySelector('input[name="logicAnswer"]:checked');
    const feedbackEl = document.getElementById('puzzleFeedback');
    if (!feedbackEl) return;
    if (!selectedOption) return displayFeedback(feedbackEl, "Please select an answer!", false);
    handleSimpleAnswerCheck(parseInt(selectedOption.value) === correctAnswer, feedbackEl, "Correct! Excellent logic!", "Incorrect. Try again!");
}

function checkPatternAnswer() {
    const userAnswer = parseInt(document.getElementById('patternAnswer')?.value);
    const feedbackEl = document.getElementById('puzzleFeedback');
    if (!feedbackEl || !currentPuzzleData) return;
    handleSimpleAnswerCheck(userAnswer === currentPuzzleData.answer, feedbackEl, "Correct! You found the pattern!", "Incorrect. Look for the pattern!");
}

// --- Color Puzzle Specific Helpers & Checker ---
function addColorToSequence(color) {
    selectedColorSequence.push(color);
    const display = document.getElementById('selectedColorsDisplay');
    if (display) {
        display.innerHTML = selectedColorSequence.map(c =>
            `<span class="selected-color" style="background-color: ${c}; color: ${isLightColor(c) ? 'black' : 'white'};">${c}</span>`
        ).join(' ');
    }
}

function resetColorSelection() {
    selectedColorSequence = [];
    const display = document.getElementById('selectedColorsDisplay');
    const feedbackEl = document.getElementById('puzzleFeedback'); // Get the feedback element
    if (display) display.innerHTML = '';
    if (feedbackEl) feedbackEl.innerHTML = ''; // Clear feedback message
}

function checkColorAnswer() {
    const feedbackEl = document.getElementById('puzzleFeedback');
    if (!feedbackEl) return;
    const correctSequence = window.currentColorSequence;
    if (!correctSequence) return displayFeedback(feedbackEl, "Error: Puzzle sequence not loaded.", false);

    const isCorrect = JSON.stringify(selectedColorSequence) === JSON.stringify(correctSequence);
    displayFeedback(feedbackEl, isCorrect ? "Perfect memory! Well done!" : "Incorrect sequence. Try again!", isCorrect);
    if (isCorrect) {
        setTimeout(() => { resetColorSelection(); nextPuzzle(); }, 1500);
    }
}

// --- Memory Game Specific Helpers & Checker ---
function initMemoryGame(gameCardsData) {
    memoryGameState = {
        flippedCardElements: [],
        matchedPairs: 0,
        attempts: 0,
        isProcessing: false,
        totalPairs: gameCardsData.length / 2
    };
    document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', () => handleMemoryCardClick(card)));
    updateMemoryStats();
}

function handleMemoryCardClick(cardElement) {
    if (memoryGameState.isProcessing || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

    cardElement.classList.add('flipped');
    memoryGameState.flippedCardElements.push(cardElement);

    if (memoryGameState.flippedCardElements.length === 2) {
        memoryGameState.isProcessing = true;
        memoryGameState.attempts++;
        updateMemoryStats();
        setTimeout(checkMemoryMatch, 1000);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryGameState.flippedCardElements;
    const feedbackEl = document.getElementById('puzzleFeedback');

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryGameState.matchedPairs++;
        if (memoryGameState.matchedPairs === memoryGameState.totalPairs) {
            if(feedbackEl) displayFeedback(feedbackEl, "All pairs found! Excellent memory!", true);
            setTimeout(nextPuzzle, 2000);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    memoryGameState.flippedCardElements = [];
    memoryGameState.isProcessing = false;
    updateMemoryStats();
}

function updateMemoryStats() {
    const pairsFoundEl = document.getElementById('pairsFound');
    const attemptsEl = document.getElementById('attempts');
    if (pairsFoundEl) pairsFoundEl.textContent = memoryGameState.matchedPairs;
    if (attemptsEl) attemptsEl.textContent = memoryGameState.attempts;
}


// ======== Main Puzzle System & Book Handling ========
const puzzleHandlers = { math: showMathPuzzle, word: showWordPuzzle, logic: showLogicPuzzle, pattern: showPatternPuzzle, color: showColorPuzzle, memory: showMemoryPuzzle };

async function openBook(index) {
    currentBookIndex = index;
    const key = `book${index}`;
    await fetchAllPuzzles();

    if (!bookProgress[key] || (bookProgress[key].puzzles?.length || 0) < 6) {
        if (allPuzzlesData.length > 0) {
            bookProgress[key] = {
                isCompleted: false, current: 0, completed: [],
                puzzles: allPuzzlesData.sort(() => 0.5 - Math.random()).slice(0, 6)
            };
            saveBookProgress();
        } else {
            console.error('No puzzles available.');
            if (puzzleContentElement) puzzleContentElement.innerHTML = '<p>Error: Could not load puzzles.</p>';
            if (modal) modal.showModal();
            return;
        }
    }
    if (bookProgress[key]?.puzzles?.length > 0) {
        showPuzzleUI(bookProgress[key].current);
        if (modal) modal.showModal();
    }
}

function closeModal() {
    if (modal) modal.close();
    saveBookProgress();
}
function showPuzzleUI(puzzleIndexInBook) {
    const bookData = bookProgress[`book${currentBookIndex}`];
    if (!bookData || !bookData.puzzles || puzzleIndexInBook >= bookData.puzzles.length) {
        if (bookData) {
            bookData.isCompleted = true;
            saveBookProgress();
            updateBookCards();
        }
        showCompletionUI();
        return;
    }
    // Update current puzzle data and UI elements
    currentPuzzleData = bookData.puzzles[puzzleIndexInBook];
    if (puzzleTitleElement) puzzleTitleElement.textContent = currentPuzzleData.title || `Puzzle ${puzzleIndexInBook + 1}`;
    if (puzzleCounterElement) puzzleCounterElement.textContent = `${puzzleIndexInBook + 1} of ${bookData.puzzles.length}`;
    if (progressFillElement) progressFillElement.style.width = `${(puzzleIndexInBook / bookData.puzzles.length) * 100}%`;
    if (puzzleContentElement) puzzleContentElement.innerHTML = '';

    const handler = puzzleHandlers[currentPuzzleData.type];
    if (handler && puzzleContentElement) {
        handler(puzzleContentElement, currentPuzzleData);
    } else if (puzzleContentElement) {
        puzzleContentElement.innerHTML = '<p>Error: Unknown puzzle type or content area missing.</p>';
    }
}

function nextPuzzle() {
    const bookData = bookProgress[`book${currentBookIndex}`];
    if (!bookData) return;
    bookData.current++;
    saveBookProgress();
    showPuzzleUI(bookData.current);
    updateBookCards();
}

function showCompletionUI() {
    if (puzzleContentElement) {
        puzzleContentElement.innerHTML = `
            <div class="completion-message">
                <div class="completion-title">Book Complete!</div>
                <div class="completion-text">You've completed all puzzles for this book!</div>
            </div>`;
    }
    if (puzzleTitleElement) puzzleTitleElement.textContent = 'All Puzzles Complete!';
    if (puzzleCounterElement) puzzleCounterElement.textContent = 'Challenge Finished';
    if (progressFillElement) progressFillElement.style.width = '100%';
}

// ======== Book Unlocking, Reset & UI Update ========
function confirmResetBook() {
    if (confirm("Reset all progress for this book? This cannot be undone.")) {
        resetCurrentBook();
    }
}

async function resetCurrentBook() {
    const key = `book${currentBookIndex}`;
    await fetchAllPuzzles();
    if (bookProgress[key] && allPuzzlesData.length > 0) {
        bookProgress[key] = {
            ...bookProgress[key],
            current: 0, completed: [], isCompleted: false,
            puzzles: allPuzzlesData.sort(() => 0.5 - Math.random()).slice(0, 6)
        };
        saveBookProgress();
        showPuzzleUI(0);
        updateBookCards();
    } else if (puzzleContentElement) {
        puzzleContentElement.innerHTML = "<p>Error: Cannot reset book, puzzle data unavailable.</p>";
    }
}

function applyCardState(card, statusTextEl, isLocked, statusMessage, addLockIcon = false) {
    if (statusTextEl) statusTextEl.textContent = statusMessage;
    card.classList.toggle('locked-card', isLocked);
    
    const bookCoverFigure = card.querySelector('.book-cover');
    if (!bookCoverFigure) return;

    bookCoverFigure.querySelector('.lock-icon')?.remove();
    bookCoverFigure.querySelector('.unlock-text')?.remove();

    if (isLocked && addLockIcon) {
        const lockIconDiv = document.createElement('div');
        lockIconDiv.className = 'lock-icon';
        lockIconDiv.innerHTML = '<i class="fa-solid fa-lock"></i>';
        
        const unlockTextP = document.createElement('p');
        unlockTextP.className = 'unlock-text';
        unlockTextP.innerHTML = 'Solve previous puzzle<br>to unlock';

        bookCoverFigure.appendChild(lockIconDiv);
        bookCoverFigure.appendChild(unlockTextP);
    }
}

function updateBookCards() {
    const cards = document.querySelectorAll('.book-card');
    let booksCompletedCount = 0;

    cards.forEach((card, i) => {
        const key = `book${i}`;
        const progressData = bookProgress[key];
        const statusTextEl = card.querySelector('.book-status');
        let isLocked = i !== 0 && !(bookProgress[`book${i - 1}`]?.isCompleted);
        let statusMessage;

        if (isLocked) {
            statusMessage = 'Locked';
            applyCardState(card, statusTextEl, true, statusMessage, true);
        } else {
            if (progressData?.isCompleted) {
                const numPuzzles = progressData.puzzles?.length || 6;
                statusMessage = `Completed (${numPuzzles}/${numPuzzles})`;
                booksCompletedCount++;
            } else {
                const numPuzzles = progressData?.puzzles?.length || 6;
                statusMessage = `In Progress (${progressData?.current || 0}/${numPuzzles})`;
            }
            applyCardState(card, statusTextEl, false, statusMessage);
        }
    });

    const overallProgressTracker = document.getElementById('overallProgress');
    if (overallProgressTracker) {
        overallProgressTracker.textContent = `Books Completed: ${booksCompletedCount} of ${cards.length}`;
    }
}

// ======== Init on Page Load ========
function initBookClicks() {
    document.querySelectorAll('.book-card').forEach((card, i) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('select')) return;
            if (!card.classList.contains('locked-card')) {
                openBook(i);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    loadBookProgress();
    await fetchAllPuzzles();
    updateBookCards();
    initBookClicks();
});