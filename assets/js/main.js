const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');

burgerMenu.addEventListener('click', function () {
    burgerMenu.classList.toggle('active');
    mainNav.classList.toggle('active');
});

// Define these BEFORE they are used
function openModal() {
    loadProgress();
    const modal = document.getElementById('puzzleModal');
    modal.showModal();

    if (gameData.isCompleted) {
        showCompletion();
    } else {
        showPuzzle(gameData.currentPuzzle);
    }
}

function closeModal() {
    const modal = document.getElementById('puzzleModal');
    modal.close();
    saveProgress();
}

// Book click handler
const showBtn = document.querySelectorAll('.show-dialog');

showBtn.forEach(function (btn) {
    btn.addEventListener('click', function () {
        if (btn.classList.contains('locked-card')) return;
        openModal();
    });
});

let gameData = {
    currentPuzzle: 0,
    completedPuzzles: [],
    isCompleted: false
};

function saveProgress() {
    localStorage.setItem('puzzleProgress', JSON.stringify(gameData));
    console.log('Progress saved to localStorage:', gameData);
}


function loadProgress() {
    const saved = localStorage.getItem('puzzleProgress');
    if (saved) {
        gameData = JSON.parse(saved);
        console.log('Progress loaded from localStorage:', gameData);
    } else {
        console.log('No saved progress found.');
    }
}

const puzzles = [
    {
        title: "Math Challenge",
        type: "math",
        question: "15 × 7 + 23 = ?",
        answer: 128
    },
    {
        title: "Memory Game",
        type: "memory",
        cards: ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎮', '🎲', '🎯', '🎪', '🎨', '🎭']
    },
    {
        title: "Word Puzzle",
        type: "word",
        clue: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?",
        answer: "keyboard"
    },
    {
        title: "Pattern Recognition",
        type: "pattern",
        pattern: [0, 2, 4, 11, 13, 15, 22, 24]
    },
    {
        title: "Logic Puzzle",
        type: "logic",
        question: "If all roses are flowers, and some flowers are red, which statement must be true?",
        options: [
            "All flowers are roses",
            "Some roses might be red",
            "All red things are flowers",
            "No roses are red"
        ],
        answer: 1
    },
    {
        title: "Color Sequence",
        type: "color",
        sequence: ['red', 'blue', 'green', 'yellow', 'red']
    }
];

let currentPuzzleData = {};
let memoryFlipped = [];
let memoryMatched = [];
let colorSequenceInput = [];

function showPuzzle(index) {
    if (index >= puzzles.length) {
        completeAllPuzzles();
        return;
    }

    const puzzle = puzzles[index];
    currentPuzzleData = puzzle;

    document.getElementById('puzzleTitle').textContent = puzzle.title;
    document.getElementById('puzzleCounter').textContent = `${index + 1} of ${puzzles.length}`;

    const progressPercent = (index / puzzles.length) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';

    const content = document.getElementById('puzzleContent');
    content.innerHTML = '';

    switch (puzzle.type) {
        case 'math':
            showMathPuzzle(content, puzzle);
            break;
        case 'memory':
            showMemoryPuzzle(content, puzzle);
            break;
        case 'word':
            showWordPuzzle(content, puzzle);
            break;
        case 'pattern':
            showPatternPuzzle(content, puzzle);
            break;
        case 'logic':
            showLogicPuzzle(content, puzzle);
            break;
        case 'color':
            showColorPuzzle(content, puzzle);
            break;
    }
}

function showMathPuzzle(content, puzzle) {
    content.innerHTML = `
        <div class="math-equation">${puzzle.question}</div>
        <input type="number" class="math-input" id="mathAnswer" placeholder="Enter answer">
        <button class="submit-btn" onclick="checkMathAnswer()">Submit</button>
        <div id="mathFeedback" class="feedback" style="display: none;"></div>
    `;
}

function checkMathAnswer() {
    const answer = parseInt(document.getElementById('mathAnswer').value);
    const feedback = document.getElementById('mathFeedback');

    if (answer === currentPuzzleData.answer) {
        showFeedback(feedback, 'Correct! Well done!', true);
        setTimeout(() => nextPuzzle(), 1500);
    } else {
        showFeedback(feedback, 'Try again!', false);
    }
}

function showMemoryPuzzle(content, puzzle) {
    memoryFlipped = [];
    memoryMatched = [];
    const shuffled = [...puzzle.cards].sort(() => Math.random() - 0.5);

    content.innerHTML = `
        <p>Match all the pairs!</p>
        <div class="memory-grid" id="memoryGrid"></div>
    `;

    const grid = document.getElementById('memoryGrid');
    shuffled.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'memory-card';
        button.textContent = '?';
        button.dataset.card = card;
        button.dataset.index = index;
        button.onclick = () => flipCard(button);
        grid.appendChild(button);
    });
}

function flipCard(card) {
    if (memoryFlipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.textContent = card.dataset.card;
        memoryFlipped.push(card);

        if (memoryFlipped.length === 2) {
            setTimeout(checkMemoryMatch, 1000);
        }
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryFlipped;

    if (card1.dataset.card === card2.dataset.card) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryMatched.push(card1.dataset.card);

        if (memoryMatched.length === currentPuzzleData.cards.length / 2) {
            setTimeout(() => nextPuzzle(), 1000);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '?';
        card2.textContent = '?';
    }

    memoryFlipped = [];
}

function showWordPuzzle(content, puzzle) {
    content.innerHTML = `
        <div class="word-clue">${puzzle.clue}</div>
        <input type="text" class="word-input" id="wordAnswer" placeholder="Enter your answer">
        <button class="submit-btn" onclick="checkWordAnswer()">Submit</button>
        <div id="wordFeedback" class="feedback" style="display: none;"></div>
    `;
}

function checkWordAnswer() {
    const answer = document.getElementById('wordAnswer').value.toLowerCase().trim();
    const feedback = document.getElementById('wordFeedback');

    if (answer === currentPuzzleData.answer.toLowerCase()) {
        showFeedback(feedback, 'Correct! Great thinking!', true);
        setTimeout(() => nextPuzzle(), 1500);
    } else {
        showFeedback(feedback, 'Not quite right. Think again!', false);
    }
}

function showPatternPuzzle(content, puzzle) {
    content.innerHTML = `
        <p>Click the cells to match the pattern:</p>
        <div class="pattern-grid" id="patternGrid"></div>
        <button class="submit-btn" onclick="checkPattern()">Submit</button>
        <div id="patternFeedback" class="feedback" style="display: none;"></div>
    `;

    const grid = document.getElementById('patternGrid');
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'pattern-cell';
        cell.dataset.index = i;
        cell.onclick = () => togglePatternCell(cell);
        grid.appendChild(cell);
    }
}

function togglePatternCell(cell) {
    cell.classList.toggle('active');
}

function checkPattern() {
    const cells = document.querySelectorAll('.pattern-cell');
    const activeCells = [];

    cells.forEach((cell, index) => {
        if (cell.classList.contains('active')) {
            activeCells.push(index);
        }
    });

    const feedback = document.getElementById('patternFeedback');
    const correctPattern = currentPuzzleData.pattern;

    if (activeCells.length === correctPattern.length &&
        activeCells.every(index => correctPattern.includes(index))) {
        showFeedback(feedback, 'Perfect pattern match!', true);
        setTimeout(() => nextPuzzle(), 1500);
    } else {
        showFeedback(feedback, 'Pattern doesn\'t match. Try again!', false);
    }
}

function showLogicPuzzle(content, puzzle) {
    content.innerHTML = `
        <div class="word-clue">${puzzle.question}</div>
        <div class="logic-options" id="logicOptions"></div>
        <button class="submit-btn" onclick="checkLogicAnswer()">Submit</button>
        <div id="logicFeedback" class="feedback" style="display: none;"></div>
    `;

    const options = document.getElementById('logicOptions');
    puzzle.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'logic-option';
        div.textContent = option;
        div.dataset.index = index;
        div.onclick = () => selectLogicOption(div);
        options.appendChild(div);
    });
}

function selectLogicOption(option) {
    document.querySelectorAll('.logic-option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
}

function checkLogicAnswer() {
    const selected = document.querySelector('.logic-option.selected');
    const feedback = document.getElementById('logicFeedback');

    if (!selected) {
        showFeedback(feedback, 'Please select an answer!', false);
        return;
    }

    if (parseInt(selected.dataset.index) === currentPuzzleData.answer) {
        showFeedback(feedback, 'Excellent reasoning!', true);
        setTimeout(() => nextPuzzle(), 1500);
    } else {
        showFeedback(feedback, 'Think about it more carefully!', false);
    }
}

function showColorPuzzle(content, puzzle) {
    colorSequenceInput = [];
    content.innerHTML = `
        <p>Remember and repeat the color sequence:</p>
        <div class="color-display" id="colorDisplay"></div>
        <p>Click the colors in the same order:</p>
        <div class="color-display" id="colorInput"></div>
        <button class="submit-btn" onclick="resetColorSequence()">Reset</button>
        <div id="colorFeedback" class="feedback" style="display: none;"></div>
    `;

    showColorSequence(puzzle.sequence);
    createColorInput();
}

function showColorSequence(sequence) {
    const display = document.getElementById('colorDisplay');
    display.innerHTML = '';

    sequence.forEach((color, index) => {
        setTimeout(() => {
            const circle = document.createElement('div');
            circle.className = 'color-circle active';
            circle.style.backgroundColor = color;
            display.appendChild(circle);

            setTimeout(() => circle.classList.remove('active'), 800);
        }, index * 1000);
    });
}

function createColorInput() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const input = document.getElementById('colorInput');

    colors.forEach(color => {
        const circle = document.createElement('div');
        circle.className = 'color-circle';
        circle.style.backgroundColor = color;
        circle.onclick = () => addColorToSequence(color);
        input.appendChild(circle);
    });
}

function addColorToSequence(color) {
    colorSequenceInput.push(color);

    if (colorSequenceInput.length === currentPuzzleData.sequence.length) {
        checkColorSequence();
    }
}

function checkColorSequence() {
    const feedback = document.getElementById('colorFeedback');
    const correct = colorSequenceInput.every((color, index) =>
        color === currentPuzzleData.sequence[index]
    );

    if (correct) {
        showFeedback(feedback, 'Perfect sequence!', true);
        setTimeout(() => nextPuzzle(), 1500);
    } else {
        showFeedback(feedback, 'Wrong sequence. Try again!', false);
        colorSequenceInput = [];
    }
}

function resetColorSequence() {
    colorSequenceInput = [];
    document.getElementById('colorFeedback').style.display = 'none';
}

function showFeedback(element, message, isCorrect) {
    element.textContent = message;
    element.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    element.style.display = 'block';
}

function nextPuzzle() {
    gameData.completedPuzzles.push(gameData.currentPuzzle);
    gameData.currentPuzzle++;
    saveProgress();
    showPuzzle(gameData.currentPuzzle);
}

function completeAllPuzzles() {
    gameData.isCompleted = true;
    saveProgress();
    showCompletion();
}

function showCompletion() {
    document.getElementById('puzzleContent').innerHTML = `
        <div class="completion-message">
            <div class="completion-title">🎉 Congratulations! 🎉</div>
            <div class="completion-text">
                You've successfully completed all 6 puzzles!<br>
                Your problem-solving skills are impressive!
            </div>
        </div>
    `;

    document.getElementById('puzzleTitle').textContent = 'All Complete!';
    document.getElementById('puzzleCounter').textContent = 'Challenge Finished';
    document.getElementById('progressFill').style.width = '100%';
}

loadProgress();
