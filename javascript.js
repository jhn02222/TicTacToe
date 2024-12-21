const play = document.querySelector("#play");
const form = document.querySelector("#player");
const div = document.querySelector(".gameboard");
const header = document.querySelector("#head");
const scores = document.querySelector(".scores");
scores.style.display = "none";
play.addEventListener("click", (event) => {
    event.preventDefault();
    const playerXName = document.querySelector("#playerX").value;
    const playerOName = document.querySelector("#player0").value;
    
    if(playerXName === playerOName) {
        event.preventDefault();
        alert("Please enter different names");
    } else if(!form.checkValidity()) {
        event.preventDefault();
        alert("Please fill out all required fields!");
    } else {
    // Initialize the game with the player names
    game.startGame(playerXName, playerOName);
    form.style.display = "none";
    header.style.display = "flex";
    scores.style.display = "flex";
    div.style.display = "grid";
    form.reset();
    }
});
const game = (function () {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let playerX, playerO;
    let currentPlayer;
    let moves = 0;
    let playerXWins = 0; 
    let playerOWins = 0;
    let ties = 0;
    let firstPlayer = null;  // Track who goes first (either 'X' or 'O')
    const playerXScore = document.querySelector("#PlayerXScore");
    const score1 = document.createElement("p");
    const playerOScore = document.querySelector("#PlayerOScore");
    const score2 = document.createElement("p");
    const tieScore = document.querySelector("#Tie");
    const score3 = document.createElement("p");
    playerXScore.appendChild(score1);
    tieScore.appendChild(score3);
    playerOScore.appendChild(score2);
    scores.appendChild(playerXScore);
    scores.appendChild(tieScore);
    scores.appendChild(playerOScore);
    
    const startGame = (playerXName, playerOName) => {
        moves = 0;
        playerX = player(playerXName, "X");
        playerO = player(playerOName, "O");
    
        // Decide who goes first, based on previous winner or tie
        if (firstPlayer === null) {
            currentPlayer = playerX;  // First game, X goes first
            firstPlayer = "X" // Keep track of who went first
        } else {
            if(firstPlayer == "X") {
                currentPlayer = playerX;  
            } else {
                currentPlayer = playerO; // Start with the previous winner or the one who went first
        }
    }
        header.textContent = currentPlayer.marker + ": " + currentPlayer.name.toUpperCase() + "'S TURN";
        resetBoard();
        score1.textContent = playerXName.toUpperCase() + "'S WINS: " + playerXWins;
        score2.textContent = playerOName.toUpperCase() + "'S WINS: " + playerOWins;
        score3.textContent = "TIES: " + ties;
        
        getBoard();
    };

    const resetBoard = () => {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    };

    const getBoard = () => {
        div.innerHTML = "";
       
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const square = document.createElement("div");
                square.classList.add("square");
                square.textContent = board[i][j];
                square.addEventListener("click", () => {
                    if (currentPlayer === playerX) {
                        place(i, j, playerX.marker);
                        
                    } else {
                        console.log(currentPlayer);
                        if(currentPlayer == playerX) {
                            console.log(true);
                            console.log(playerX);
                        } else {
                            console.log(playerX);
                            console.log(false);
                        }
                        place(i, j, playerO.marker);
                        
                    }
                });
                div.appendChild(square);
            }
        }
    };

    const place = (row, col, marker) => {
        if (board[row][col] === "") {
            board[row][col] = marker;
            addMove();
            getBoard();
    
            // Update turn after placing the marker
            if (currentPlayer === playerX) {
                currentPlayer = playerO;
                header.textContent = "O: " + currentPlayer.name.toUpperCase() + "'S TURN";
            } else {
                currentPlayer = playerX;
                header.textContent = "X: " + currentPlayer.name.toUpperCase() + "'S TURN";
            }
            checkWinner();
        } else {
            alert("Choose a different UNOCCUPIED square");
        }
    };
    

    const getMoves = () => moves;
    const addMove = () => moves++;
    const addScore = (winner) => {
        if (winner === "X") {
            playerXWins++;
        } else if (winner === "O") {
            playerOWins++;
        } else {
            ties++;
        }
    };

    const checkWinner = () => {
        const dialog = document.createElement("dialog");
        const winner = document.createElement("p");
        const playAgain = document.createElement("button");
        playAgain.textContent = "Play Again";
        playAgain.addEventListener("click", () => {
            startGame(playerX.name, playerO.name);
            dialog.close();
        });

        const reset = document.createElement("button");
        reset.textContent = "Reset";
        reset.addEventListener("click", () => {
            playerXWins = 0;
            playerOWins = 0;
            ties = 0;
            form.style.display = "flex";
            header.style.display = "none";
            div.style.display = "none";
            scores.style.display = "none";
            resetBoard();
            dialog.close();
        });

        dialog.appendChild(playAgain);
        dialog.appendChild(reset);
        dialog.appendChild(winner);

        const winningPatterns = [
            [[0, 0], [0, 1], [0, 2]], // Row 1
            [[1, 0], [1, 1], [1, 2]], // Row 2
            [[2, 0], [2, 1], [2, 2]], // Row 3
            [[0, 0], [1, 0], [2, 0]], // Col 1
            [[0, 1], [1, 1], [2, 1]], // Col 2
            [[0, 2], [1, 2], [2, 2]], // Col 3
            [[0, 0], [1, 1], [2, 2]], // Diagonal 1
            [[0, 2], [1, 1], [2, 0]]  // Diagonal 2
        ];

        for (let pattern of winningPatterns) {
            const [a, b, c] = pattern;
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                winner.textContent = `${board[a[0]][a[1]]} wins!`;

                // Update score and set who will start the next game
                if (board[a[0]][a[1]] === "X") {
                    addScore("X");
                    firstPlayer = "X"; // X won, so X starts next game
                } else if (board[a[0]][a[1]] === "O") {
                    addScore("O");
                    firstPlayer = "O"; // O won, so O starts next game
                }
                document.body.appendChild(dialog);
                dialog.showModal();
                return;
            }
        }

        if (moves === 9) {
            winner.textContent = "It's a tie!";
            addScore("tie");

            // Alternate who goes first in the next round
            if(firstPlayer == "X") {
                firstPlayer = "O";
            } else {
                firstPlayer = "X";
            }

            document.body.appendChild(dialog);
            dialog.showModal();
        }
    };

    return { startGame, resetBoard, getBoard, place, getMoves, addMove };
}) ();

function player (name, marker) {
    return { name, marker };
}
