//81-element list for board positions
var board = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1
];

var flagged = [];

const waitMs = (ms) => new Promise((res) => setTimeout(res, ms));

var boardElements = [];
var enableEvents = true;
var tileReveals = 0;
var gameStartedTime = Math.floor(Date.now() / 1000);
var bombsRemaining = 10;

function updateTimer() {
    if (tileReveals === 0) {
        gameStartedTime = Math.floor(Date.now() / 1000);
    } else {
        document.getElementById("time").innerHTML = String(Math.floor(Date.now() / 1000) - gameStartedTime).padStart(3, '0');
    }
}

const timerInterval = window.setInterval(updateTimer, 1000);

function generateBombs() {
    for (var i = 0; i < 10; i++) {
        let randomIndex = Math.floor(Math.random() * 81);
        //use 1 for bomb
        if (board[randomIndex] === 9) {
            i--
        } else {
            board[randomIndex] = 9;
        }
    }
}

function confirmSameRow(num1, num2) {
    return ((num1 - (num1 % 9)) / 9) === num2;
}

function returnValueIfNotExists(targetSquareNumber, value, intendedRow) {
    if (targetSquareNumber < 0) {
        return value;
    } else if (targetSquareNumber > 80) {
        return value;
    } else if (confirmSameRow(targetSquareNumber, intendedRow)) {
        return board[targetSquareNumber];
    } else {
        return value;
    }
}

function rowOfNum(num) {
    return (num - (num % 9)) / 9;
}

function findNumberOfNbrs(squarenumber) {
    if (board[squarenumber] === 9) {
        return 9;
    }

    var numberOfNbrs = 0;

    if (returnValueIfNotExists(squarenumber - 10, 0, rowOfNum(squarenumber) - 1) === 9) {
        numberOfNbrs++
    }
    if (returnValueIfNotExists(squarenumber - 9, 0, rowOfNum(squarenumber) - 1) === 9) {
        numberOfNbrs++
    }
    if (returnValueIfNotExists(squarenumber - 8, 0, rowOfNum(squarenumber) - 1) === 9) {
        numberOfNbrs++
    }

    if (returnValueIfNotExists(squarenumber - 1, 0, rowOfNum(squarenumber)) === 9) {
        numberOfNbrs++
    }
    if (returnValueIfNotExists(squarenumber + 1, 0, rowOfNum(squarenumber)) === 9) {
        numberOfNbrs++
    }

    if (returnValueIfNotExists(squarenumber + 8, 0, rowOfNum(squarenumber) + 1) === 9) {
        numberOfNbrs++
    }
    if (returnValueIfNotExists(squarenumber + 9, 0, rowOfNum(squarenumber) + 1) === 9) {
        numberOfNbrs++
    }
    if (returnValueIfNotExists(squarenumber + 10, 0, rowOfNum(squarenumber) + 1) === 9) {
        numberOfNbrs++
    }

    return numberOfNbrs;
}

function exposeTileIfEmpty(targetNumber, targetRow) {
    if (targetNumber >= 0 && targetNumber < 81) {
        if (confirmSameRow(targetNumber, targetRow)) {
            processClick("c_" + targetNumber, true);
        }
    }
}

function exposeEmptyArea(squarenumber) {
    if (board[squarenumber] === 0) {
        exposeTileIfEmpty(squarenumber - 8, rowOfNum(squarenumber) - 1);
        exposeTileIfEmpty(squarenumber - 9, rowOfNum(squarenumber) - 1);
        exposeTileIfEmpty(squarenumber - 10, rowOfNum(squarenumber) - 1);

        exposeTileIfEmpty(squarenumber - 1, rowOfNum(squarenumber));
        exposeTileIfEmpty(squarenumber + 1, rowOfNum(squarenumber));

        exposeTileIfEmpty(squarenumber + 8, rowOfNum(squarenumber) + 1);
        exposeTileIfEmpty(squarenumber + 9, rowOfNum(squarenumber) + 1);
        exposeTileIfEmpty(squarenumber + 10, rowOfNum(squarenumber) + 1);
    }
}

function revealEntireBoard() {
    for (var i = 0; i < 81; i++) {
        if (board[i] !== -1 && board[i] !== 0) {
            if (board[i] === 9) {
                document.getElementById("c_" + i).src = "assets/14.png";
            } else if (board[i] === -1 || board[i] === 0) {
                document.getElementById("c_" + i).src = "assets/08.png";
            } else {
                document.getElementById("c_" + i).src = "assets/" + String(board[i] - 1).padStart(2, '0') + ".png";
            }
        }
    }
}

var numberColorClasses = ["clear", "one", "two", "three", "four", "five", "six", "seven", "eight"];

function checkwin() {
    var count = 0;
    for (var i = 0; i < flagged.length; i++) {
        if (board[Number(flagged[i].slice(2))] === 9) {
            count++
        }
    }
    return count === 10;
}

function processClick(cellID, computerMove) {
    if (enableEvents) {
        if (flagged.includes(cellID) && !computerMove) {
            var confirmation = confirm("Are you sure you would like to select a flagged box?");
            if (confirmation) {
                bombsRemaining--;
                document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
                flagged = flagged.filter(item => item !== cellID)
                document.getElementById(cellID).src = "assets/09.png";
                processClick(cellID, true);
            }
        } else if (flagged.includes(cellID) && computerMove) {
            bombsRemaining++;
            document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
            flagged = flagged.filter(item => item !== cellID)
            document.getElementById(cellID).src = "assets/09.png";
            processClick(cellID, true);
        } else {
            tileReveals++;
            document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
            var cellNumber = Number(cellID.slice(2));
            if (board[cellNumber] === -1) {
                var cellEle = document.getElementById(cellID);

                let nbrscnt = findNumberOfNbrs(cellNumber);
                board[cellNumber] = nbrscnt;

                if (nbrscnt !== 0) {
                    cellEle.src = "assets/" + String(nbrscnt - 1).padStart(2, '0') + ".png";
                } else if (nbrscnt === 0) {
                    cellEle.src = "assets/08.png";
                    exposeEmptyArea(cellNumber);
                }

                cellEle.classList.add("clear");
                cellEle.classList.add(numberColorClasses[nbrscnt]);
                if (checkwin()) {
                    alert("w");
                    revealEntireBoard();
                    window.clearInterval(timerInterval);
                }
            } else if (board[cellNumber] === 9) {
                console.log("boom.");
                document.getElementById("smiley").src = "assets/sad.png";
                document.getElementById(cellID).src = "assets/15.png";
                var cellEle = document.getElementById(cellID);
                cellEle.style.color = "#f00";

                enableEvents = false;

                revealEntireBoard()

                window.clearInterval(timerInterval);
                document.getElementById(cellID).src = "assets/15.png";
            }
        }
    }
}

function processRightClick(id, event) {
    if (enableEvents) {
        if (board[Number(id.slice(2))] === -1 || board[Number(id.slice(2))] === 9) {
            if (flagged.includes(id)) {
                bombsRemaining++;
                document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
                document.getElementById(id).src = "assets/09.png";
                flagged = flagged.filter(item => item !== id);
            } else {
                if (bombsRemaining > 0) {
                    bombsRemaining--;
                    document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
                    document.getElementById(id).src = "assets/10.png";
                    flagged.push(id);
                }
                if (bombsRemaining === 0 && checkwin()) {
                    enableEvents = false;
                    revealEntireBoard();
                    window.clearInterval(timerInterval);
                    document.getElementById("smiley").src = "assets/happy.png";
                }
            }
        }
    }
}

function playGame() {
    //creating elements
    for (var i = 0; i < 81; i++) {
        let gridcell = document.createElement("img");
        gridcell.src = "assets/09.png"
        gridcell.setAttribute("id", "c_" + i);
        gridcell.classList.add("pgrid-c");
        document.getElementById("ms_grid").appendChild(gridcell);
    }

    //adding bombs, rendering board
    generateBombs();

    boardElements = Array.from(document.getElementById("ms_grid").children);

    for (var i = 0; i < 81; i++) {
        boardElements[i].addEventListener("click", function(event) {
            processClick(this.id, false);
        })
        boardElements[i].addEventListener("contextmenu", function(event) {
            event.preventDefault();
            processRightClick(this.id, event);
        }, false);
    }
}

function resetGame() {
    window.location.reload();
}

async function closeButton() {
    var audio = new Audio("assets/shutdown.mp3");
    await audio.play();
    document.getElementById("mswpr-window").style.display = "none";
}

async function minimizeButton() {
    var audio = new Audio("assets/error.mp3");
    await audio.play();
}

function toggleFullScreen() {
    if (!window.screenTop && !window.screenY) {
        document.exitFullscreen();
    } else {
        document.getElementById("mswpr-window").requestFullscreen();
    }
}