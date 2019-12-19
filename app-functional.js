console.log("it's alive") // Test to see if JS is loading correctly

// Function to create a new gameboard evaluator. This is what will be evaluated for the win-lose scenario instead of the user interface, since an array of arrays will be easier to evaluate than a single array of 42 values. 
let newGameBoard = () => {
    return [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
}

// Here are the global variables. Gameboard is only used within each game. gameStats.counter allows for the P1/P2 toggle. gameStats.redCount and gameStats.blackCount are used by each function to evaluate whether or not the player has a winning series of four (might get locally scoped). gameStats.playerOneWin and playerTwo win will simply store boolean values to evaluate after the winning functions read.
let gameStats = {
    gameBoard: newGameBoard(),
    counter: 0,
    redCount: 0,
    blackCount: 0,
    playerOneWin: 0,
    playerTwoWin: 0,
}


// This function grabs what space the user clicked on; each circular div has an index of 0-41
let slotIndex = () => {
    let clickIndex = 0;
    for (let i = 0; i < 42; i++) {
        if (document.querySelectorAll('.slot')[i] === event.target) {
            clickIndex = i;
        }
    }
    return clickIndex;

}

let sinkToBottom = () => {
    let ind = slotIndex()
    let remainder = 5 - ind % 6;
    ind += remainder;
    return ind;
}

const setThePiece = () => {
    let num = sinkToBottom()
    let row = num % 6;
    let col = Math.floor(num / 6);
    while (gameStats.gameBoard[row][col] != 0) {
        if (num % 6 === 0) {
            break
        }
        else {
            row--
        }
    }
    gameStats.gameBoard[row][col] = setColor()
    console.log(gameStats.gameBoard)
    gameStats.counter++
    return [row, col]
}

let setColor = () => (gameStats.counter % 2 === 0) ? 'R' : 'B'

const convertToGameboard = (row, col) => row + col * 6

const userClick = ([row, col]) => {
    let num = convertToGameboard(row, col)
    if (gameStats.gameBoard[row][col] === 'R') {
        resetColor(document.querySelectorAll('.slot')[num],'red')
    }
    else if (gameStats.gameBoard[row][col] === 'B') {
        resetColor(document.querySelectorAll('.slot')[num],'black')
    }
}


// The main function for game play. This takes the input of the user and converts it to the gameboard in the console. It also increments the gameStats.counter one this takes place.
// ******NOTE: Want the popup to appear as soon as someone wins
let playTheGame = () => {
    let winner = didSomeoneWin();
    console.log(`Somebody won: ${winner}`)
    if (winner == true) {
        chooseWinner()
    }
    else {
        userClick(setThePiece())
    }
    if (gameStats.counter >= 42) {
        alert(`It's a tie!`)
    }
}

let chooseWinner = () => {
    if (gameStats.counter % 2 === 0) {
        alert('Player 2 Wins!')
        gameStats.playerTwoWin++
        changeScoreboard(gameStats.playerTwoWin,'#p2score')
    }
    else {
        alert('Player 1 Wins!')
        gameStats.playerOneWin++
        changeScoreboard(gameStats.playerOneWin,'#p1score')
    }
}

const changeScoreboard = (newData, changeField) => {
    document.querySelector(changeField).innerText = newData
}

// This function is the evaluator fuction. It checks each slot to determine if it is red or black, and then adds it to an ongoing count 
const checkBoard = (slot) => {
    switch (slot) {
        case 0:
            break
        case 'R':
            gameStats.redCount++
            gameStats.blackCount = 0;
            if (gameStats.redCount === 4) {
                break
            }
            break
        case 'B':
            gameStats.redCount = 0;
            gameStats.blackCount++;
            if (gameStats.blackCount === 4) {
                break
            }
    }
}

const collectAndReset = (arr1,arr2) => {
    arr1.push(gameStats.redCount)
    arr2.push(gameStats.blackCount)
    gameStats.redCount = 0;
    gameStats.blackCount = 0;
}

// This is the first of four winning functions. This sees if there is a 4 pair across any of the rows
let winAcross = () => {
    let redWin = [];
    let blackWin = [];
    for (let j = 5; j >= 0; j--) {
        for (let k = 0; k < 7; k++) {
            let i = gameStats.gameBoard[j][k]
            checkBoard(i)
        }
        collectAndReset(redWin,blackWin)
    }
    return fourTogether(redWin, blackWin)
}
// This function tests to see if a player has won vertically 
let winVertical = () => {
    let redWin = [];
    let blackWin = [];
    for (let i = 0; i < 7; i++) {
        for (let j = 5; j >= 0; j--) {
            let k = gameStats.gameBoard[j][i];
            checkBoard(k)
        }
        collectAndReset(redWin,blackWin)
    }
    return fourTogether(redWin, blackWin)
}

// This function will evaluate across the diagonal from bottom left to top right
let winNEtoSW = () => {
    let redWin = [];
    let blackWin = [];
    let k = 0;
    for (let j = 0; j < 4; j = k) {
        for (let i = 5; i >= 2; i--) {
            let m = gameStats.gameBoard[i][j];
            checkBoard(m)
            j++
        }
        k++;
        collectAndReset(redWin,blackWin)
    }
    return fourTogether(redWin, blackWin)
}

// This function will evaluate across the diagonal from bottom right to top left
let winNWtoSE = () => {
    let redWin = [];
    let blackWin = [];
    let k = 6;
    for (let j = 6; j > 2; j = k) {
        for (let i = 5; i >= 2; i--) {
            let m = gameStats.gameBoard[i][j];
            checkBoard(m)
            j--
        }
        k--;
        collectAndReset(redWin,blackWin)
    }
    return fourTogether(redWin, blackWin)
}

// This function takes all of the separate winning functions to see if any of them have flipped to true. It also keeps the scoreboard for how many times each player has won.
let didSomeoneWin = () => (winAcross() || winVertical() || winNWtoSE() || winNEtoSW());

// This function evaluates whether or not there are four in a row in any particular direction
let fourTogether = (arr1, arr2) => {
    let red = arr1.some(int => int === 4);
    let black = arr2.some(int => int === 4);
    return (red || black);
}

// This was a shorter way of selecting the list of slot divs, but I didn't use it too much
let slotList = () => {
    return document.querySelectorAll('.slot')
}
// Generic function to reset the color of an element in an array
const resetColor = (elem, color) => elem.style.backgroundColor = color

// Function to start a new game, one of the three event listeners in my code. Clears the visual display and the gameboard in the background
let newGame = () => {
    gameStats.gameBoard = newGameBoard();
    gameStats.counter = 0;
    slotList().forEach(elem => resetColor(elem,'rgb(0,153,219)'))
}

// Function to restart a session, equivalent to refreshing the page
const resetSession = () => {
    newGame()
    gameStats.playerOneWin = 0
    gameStats.playerTwoWin = 0
    changeScoreboard(0,'#p1score')
    changeScoreboard(0,'#p2score')
}


// *****The event listeners!*********

// The first one takes the play the game function and applies it to slot in the container
slotList().forEach(slot => slot.addEventListener('click', playTheGame, true))

// The second event listener runs the new Game function to reset the gameStats.counter, clear the console gameboard, and resets the user interface.
document.querySelector('.restart').addEventListener('click', newGame)

// The third event listener runs the new Game function to reset the gameStats.counter, clear the console gameboard, and resets the user interface.
document.querySelector('.newSession').addEventListener('click', resetSession)