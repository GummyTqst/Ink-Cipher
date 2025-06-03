const symbols = ['☀️', '♦️', '🌙', '💎', '💚'];
        let symbolMapping = {};
        let solutionVisible = false;

        function generatePuzzle() {
            // Create alphabet array
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            
            // Randomly assign 5 letters to symbols
            const shuffledAlphabet = [...alphabet].sort(() => Math.random() - 0.5);
            symbolMapping = {};
            
            for (let i = 0; i < symbols.length; i++) {
                symbolMapping[symbols[i]] = shuffledAlphabet[i];
            }

            // Create grid with symbols
            const grid = document.getElementById('alphabetGrid');
            grid.innerHTML = '';

            alphabet.forEach((letter, index) => {
                const cell = document.createElement('div');
                cell.className = 'alphabet-cell';

                // Check if this letter has a symbol
                const symbol = Object.keys(symbolMapping).find(key => symbolMapping[key] === letter);
                if (symbol) {
                    cell.textContent = symbol;
                } else {
                    cell.textContent = letter;
                }

                grid.appendChild(cell);
            });

            // Clear inputs and feedback
            document.getElementById('longInput').value = '';
            document.getElementById('feedback').textContent = '';
            solutionVisible = false;
        }

        function checkAnswers() {
            const longInput = document.getElementById('longInput');
            const userGuesses = longInput.value.toUpperCase().split('');
            
            if (userGuesses.length !== 5) {
                const feedback = document.getElementById('feedback');
                feedback.textContent = 'Please enter exactly 5 letters!';
                feedback.className = 'feedback incorrect';
                return;
            }

            let correct = 0;
            let total = symbols.length;

            for (let i = 0; i < symbols.length; i++) {
                const userGuess = userGuesses[i];
                const correctAnswer = symbolMapping[symbols[i]];

                if (userGuess === correctAnswer) {
                    correct++;
                }
            }

            if (correct === total) {
                longInput.style.borderColor = '#90EE90';
                const feedback = document.getElementById('feedback');
                feedback.textContent = 'Congratulations! You solved the cipher!';
                feedback.className = 'feedback correct';
            } else {
                longInput.style.borderColor = '#FFB6C1';
                const feedback = document.getElementById('feedback');
                feedback.textContent = `${correct}/${total} correct. Keep trying!`;
                feedback.className = 'feedback incorrect';
            }
        }

        // function showSolution() {
        //     if (solutionVisible) return;

        //     const longInput = document.getElementById('longInput');
        //     let solution = '';
        //     for (let i = 0; i < symbols.length; i++) {
        //         solution += symbolMapping[symbols[i]];
        //     }
        //     longInput.value = solution;
        //     longInput.style.borderColor = '#d4af37';

        //     const feedback = document.getElementById('feedback');
        //     feedback.textContent = 'Solution revealed!';
        //     feedback.className = 'feedback';
        //     solutionVisible = true;
        // }

        function newPuzzle() {
            generatePuzzle();
            const longInput = document.getElementById('longInput');
            longInput.value = '';
        }

        // Add input event listener for the long input
        const longInput = document.getElementById('longInput');
        longInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });

        // Initialize puzzle
        generatePuzzle();


// Anagram Puzzle
const clueLettersDiv = document.getElementById('clueLetters');
const grid = document.getElementById('anagramGrid');
const newPuzzleBtn = document.getElementById('newPuzzleBtn');
const continueBtn = document.getElementById('continueBtn');

const wordCache = {}

function getInputs() {
    return Array.from(grid.querySelectorAll("input"))
}

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('')
}

async function isValidWord(word) {
    if (wordCache[word]) return wordCache[word];
    try {
        const res = await fetch (`https://api.datamuse.com/words?sp=${word}&max=1`)
        const data = await res.json()
        const valid = data.length > 0 && data[0].word.toUpperCase() === word;
        wordCache[word] = valid
        return valid
    } catch (err) {
        console.error("API error:", err)
        return false;
    }
}

async function validateRows() {
    const inputs = getInputs()
    let foundValid = false;

    for (let row = 0; row < 5; row++) {
        const rowInputs = inputs.slice(row * 5, row * 5 + 5)
        const word = rowInputs.map(input => input.value.toUpperCase()).join("")
        const valid = word.length === 5 && await isValidWord(word)

        if (valid) foundValid = true;

        rowInputs.forEach(input => {
            input.classList.toggle("valid-word", valid)
        })

        continueBtn.disabled = !foundValid
    }
}

function renderGrid() {
    grid.innerHTML = ''
    for (let i = 0; i < 25; i++) {
        const input = document.createElement("input")
        input.type = "text";
        input.maxLength = 1;

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase()
            if (e.target.value.length === 1 && e.target.nextElementSibling) {
                e.target.nextElementSibling.focus()
            }
            validateRows()
        })

        grid.appendChild(input)
    }
}

async function newPuzzle() {
    try {
        const res = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        const data = await res.json();
        const word = data[0].toUpperCase()
        const shuffled = shuffleWord(word)

        clueLettersDiv.textContent = shuffled.split('').join(' ');
        wordCache[word] = true
        renderGrid()
        continueBtn.disabled = true
    } catch (err) {
        console.error("Failed to get random word:", err)
        clueLettersDiv.textContent = "ERROR"
    }
}

continueBtn.addEventListener("click", () => {
    alert("You found a word! You can now continue")
    // Example: window.location.href = "/next.html";
})

newPuzzleBtn.addEventListener("click", newPuzzle)

window.onload = () => {
    newPuzzle()
}