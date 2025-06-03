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