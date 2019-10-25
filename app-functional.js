console.log("it's alive") // Test to see if JS is loading correctly

// Function to create a new gameboard evaluator. This is what will be evaluated for the win-lose scenario instead of the user interface, since an array of arrays will be easier to evaluate than a single array of 42 values. 
let newGameBoard = () => {
return [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
];
}

// Here are the global variables. Gameboard is only used within each game. gameStats.counter allows for the P1/P2 toggle. redCount and blackCount are used by each function to evaluate whether or not the player has a winning series of four (might get locally scoped). playerOneWin and playerTwo win will simply store boolean values to evaluate after the winning functions read.
let gameBoard = newGameBoard();
let counter = 0;
let redCount = 0;
let blackCount = 0;
let playerOneWin = 0;
let playerTwoWin = 0;

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
    console.log(clickIndex)
    return clickIndex;

}
// // This function sends the chip to the bottom of the column of where the user clicked.

// let sinkToBottom = () => {
//     let ind = slotIndex();
//     let remainder = 5-ind%6;
//     ind+=remainder;
//     return ind;
// }

// // This function allows for the stacking to take place (also took a very long time to figure out; had to fix some other functions first). If there is already something there, then keep looking up the column until there is an empty space.

// // *****NOTE: Need to make sure nothing happens when a top slot is chosen.
// let setThePiece = () => {
//     let num = sinkToBottom()
//     while(slotList()[num].style.backgroundColor === 'red' || slotList()[num].style.backgroundColor === 'black') {
//         if (num%6 === 0) {
//             return null;
//         }
//         else {
//             num--}
//     }
//     return num
// }

// // These two functions take the slot of setThePiece and turn it black or yellow. Also, it stores a value for the behind the scenes gameboard.
// // ******NOTE: Need to add something to show who's turn it is
// let userClickRed = () => {
//     let theSlot = setThePiece()
//     if (event.target.className === 'slot') {
//         document.querySelectorAll('.slot')[theSlot].style.backgroundColor = 'red';
//     }
//     return [theSlot, 'R'];
// }

// let userClickBlack = () => {
//     let theSlot = setThePiece()
//     if (event.target.className === 'slot') {
//         document.querySelectorAll('.slot')[theSlot].style.backgroundColor = 'black';
//     }
//     return [theSlot, 'B'];

// }

// // This function reads our globally defined gameStats.counter and sees whether or not it is even or odd. That is how red and black is toggled.
// let toggleUser = () => {
//     let theClick;
//     if (gameStats.counter%2 === 0) {
//         theClick = userClickRed();
//     }
//     else {
//         theClick = userClickBlack();
//     }
//     return theClick;
// }

// // let toggleUserTurn = () => (gameStats.counter%2 === 0) ? userClick('Red') : userClick('Black')
// // console.log(toggleUserTurn())

// let amendGameboard = () => {
//     let user = toggleUser();
//     let newChip = user[1]
//     let row = user[0]%6;
//     let col = Math.floor(user[0]/6);
//     gameBoard[row][col] = newChip;
//     gameStats.counter++;
// }

let sinkToBottom = () => {
    let ind = slotIndex()
    let remainder = 5-ind%6;
    ind+=remainder;
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
    return [row,col]
}

let setColor = () => (gameStats.counter % 2 === 0) ? 'R' : 'B'

const convertToGameboard = (row,col) => row + col*6

const userClick = ([row, col]) => {
    let num = convertToGameboard(row, col)
    console.log(num)
    // for (let i = 0; i < 6; i++) {
    //     for (let j = 0; j < 7; j++) {
    //         if (gameStats.gameBoard[i][j] === 'R') {
    //             console.log(`R located at row ${i} and column ${j}`)
    //         }
    //         // if (gameStats.gameBoard[i][j] === 'R') {
    //         //     document.querySelectorAll('.slot')[num].style.backgroundColor = 'red'
    //         // }
    //         // else if (gameStats.gameBoard[i][j] === 'B') {
    //         //     document.querySelectorAll('.slot')[num].style.backgroundColor = 'black'
    //         // }
    //     }
    // }
    if (gameStats.gameBoard[row][col] === 'R') {
        document.querySelectorAll('.slot')[num].style.backgroundColor = 'red'
    }
    else if (gameStats.gameBoard[row][col] === 'B') {
        document.querySelectorAll('.slot')[num].style.backgroundColor = 'black'
    }
}


// The main function for game play. This takes the input of the user and converts it to the gameboard in the console. It also increments the gameStats.counter one this takes place.
// ******NOTE: Want the popup to appear as soon as someone wins
let playTheGame = () => {
    let winner = false //didSomeoneWin();
    if (winner == true) {
        chooseWinner()
    }
    else {
        userClick(setThePiece())
    }
    if (gameStats.counter >=42) {
        alert(`It's a tie!`)
    }
}

let chooseWinner = () => {
    if (gameStats.counter%2 === 0) {
        alert('Player 2 Wins!')
        playerTwoWin++
        document.querySelector('#p2score').innerText = playerTwoWin;
    }
    else {
        alert('Player 1 Wins!')
        playerOneWin++
        document.querySelector('#p1score').innerText = playerOneWin;
    }
}

let evalBoard = (j,k) => {
    let i = gameBoard[j][k];
    switch (i) {
        case 0:
            break
        case "R": 
            redCount++
            blackCount = 0;
            if (redCount === 4) {
                break
            }
        case "B":
            blackCount++
            redCount = 0;
            if (blackCount === 4) {
                break
            }
    }
    return [redCount, blackCount]
}

let resetcounter = (a,b) => {
    a = 0;
    b = 0
}

// This is the first of four winning functions. This sees if there is a 4 pair across any of the rows
let winAcross = () => {
    let board;
    let redWin = [];
    let blackWin = [];
    for (let j = 5; j >= 0; j--) {
        for (let k = 0; k < 7; k++) {
            // board = evalBoard(j,k)
            // console.log(board)
            let i = gameBoard[j][k];
            if (i === 0) {
                break}
            if (i === "R") {
                redCount++
                blackCount = 0;
                if (redCount === 4) {
                    alert("Player 1 Wins!")
                    break}
                }
            if (i === "B") {
                blackCount++
                redCount = 0;
                if (blackCount === 4) {
                    alert("Player 2 Wins!")
                    break}
            }
        }
        redWin.push(board[0])
        blackWin.push(board[1])
        resetcounter(redCount,blackCount)
    }
    return fourTogether(redWin,blackWin)
}

// This function tests to see if a player has won vertically 
let winVertical = () => {
    let redWin = [];
    let blackWin = [];
    for (let i = 0; i < 7; i++) {
        for (let j = 5; j >= 0; j--) {
            let k = gameBoard[j][i];
            if (k === 0) {
                break}
            if (k === "R") {
                redCount++
                blackCount = 0;
                if (redCount === 4) {
                    alert("Player 1 Wins!")
                    break}
                }
            if (k === "B") {
                blackCount++
                redCount = 0;
                if (blackCount === 4) {
                    alert("Player 2 Wins!")
                    break}
            } 
        }
        redWin.push(redCount)
        blackWin.push(blackCount)
        redCount = 0;
        blackCount = 0;
    }
    return fourTogether(redWin,blackWin)
}

// This function will evaluate across the diagonal from bottom left to top right
let winNEtoSW = () => {
    let redWin = [];
    let blackWin = [];
    let k = 0;
    for (let j = 0; j < 4; j = k) {
        for (let i = 5; i >= 2; i--) {
            let m = gameBoard[i][j];
            if (m === 0) {
                break
            }
            if (m === "R") {
                redCount++
                blackCount = 0;
                if (redCount === 4) {
                    break
                }
            }
            if (m === "B") {
                blackCount++
                redCount = 0;
                if (blackCount === 4) {
                    break
                }
            }
            j++
        }
        k++;
        redWin.push(redCount)
        blackWin.push(blackCount)
        redCount = 0;
        blackCount = 0;
    }
    return fourTogether(redWin,blackWin)
}

// This function will evaluate across the diagonal from bottom right to top left
let winNWtoSE = () => {
    let redWin = [];
    let blackWin = [];
    let k = 6;
    for (let j = 6; j > 2; j = k) {
        for (let i = 5; i >= 2; i--) {
            let m = gameBoard[i][j];
            if (m === 0) {
                break
            }
            if (m === "R") {
                redCount++
                blackCount = 0;
                if (redCount === 4) {
                    alert("Player 1 Wins!")
                    break
                }
            }
            if (m === "B") {
                blackCount++
                redCount = 0;
                if (blackCount === 4) {
                    alert("Player 2 Wins!")
                    break
                }
            }
            j--
        }
        k--;
        redWin.push(redCount)
        blackWin.push(blackCount)
        redCount = 0;
        blackCount = 0;
    }
    return fourTogether(redWin,blackWin)
}

// This function takes all of the separate winning functions to see if any of them have flipped to true. It also keeps the scoreboard for how many times each player has won.
let didSomeoneWin = () =>  (winAcross() || winVertical() || winNWtoSE() || winNEtoSW());

// This function evaluates whether or not there are four in a row in any particular direction
let fourTogether = (arr1,arr2) => {
    let red = arr1.some(int => int === 4);
    let black = arr2.some(int => int === 4);
    return (red || black);
}

// This was a shorter way of selecting the list of slot divs, but I didn't use it too much
let slotList = () => {
    return document.querySelectorAll('.slot')
}


// Function to start a new game, one of the three event listeners in my code. Clears the visual display and the gameboard in the background
let newGame = () => {
    for (let i in slotList()) {
        slotList()[i].style.backgroundColor = 'rgb(0,153,219)'
    }
    gameBoard = newGameBoard();
    gameStats.counter = 0;
    return gameBoard;
}

// *****The event listeners!*********

// The first one takes the play the game function and applies it to anywhere in the container

// ******NOTE: I need it to only apply to any slot within the container div and not the full container div itself. I'm still trying to figure that out. 
for (let slot in slotList()) {
    slotList()[slot].addEventListener('click', playTheGame, true)
}
// The second event listener runs the new Game function to reset the gameStats.counter, clear the console gameboard, and resets the user interface.
document.querySelector('.restart').addEventListener('click', newGame)









