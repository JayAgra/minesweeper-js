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

var boardElements = [];
var enableEvents = true;
var tileReveals = 0;
var gameStartedTime = Math.floor(Date.now() / 1000);
var bombsRemaining = 0;

function updateTimer() {
  if (tileReveals === 0) {
    gameStartedTime = Math.floor(Date.now() / 1000);
  } else {
    document.getElementById("time").innerHTML = String(Math.floor(Date.now() / 1000) - gameStartedTime).padStart(3, '0');
  }
}

const timerInterval = window.setInterval(updateTimer, 1000);

function generateBombs() {
    bombsRemaining = Math.floor(Math.random() * 9 + 9); //9 to 17 inclusive
    for (var i = 0; i < bombsRemaining; i++) {
        let randomIndex = Math.floor(Math.random() * 81);
        //use 1 for bomb
        if (board[randomIndex] === 9) {
            i--
        } else {
            board[randomIndex] = 9;
        }
    }
    console.log(board);
}

function populateBoard() {
    for (var i = 0; i < 81; i++) {
        if (board[i] !== -1 && board[i] !== 9) {
            document.getElementById("c_" + i).innerHTML = board[i];
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
    if (board[squarenumber] === 9) {return 9;}

    var numberOfNbrs = 0;

    if (returnValueIfNotExists(squarenumber - 10, 0, rowOfNum(squarenumber) - 1) === 9) {numberOfNbrs++}
    if (returnValueIfNotExists(squarenumber - 9, 0, rowOfNum(squarenumber) - 1) === 9) {numberOfNbrs++}
    if (returnValueIfNotExists(squarenumber - 8, 0, rowOfNum(squarenumber) - 1) === 9) {numberOfNbrs++}

    if (returnValueIfNotExists(squarenumber - 1, 0, rowOfNum(squarenumber)) === 9) {numberOfNbrs++}
    if (returnValueIfNotExists(squarenumber + 1, 0, rowOfNum(squarenumber)) === 9) {numberOfNbrs++}

    if (returnValueIfNotExists(squarenumber + 8, 0, rowOfNum(squarenumber) + 1) === 9) {numberOfNbrs++}
    if (returnValueIfNotExists(squarenumber + 9, 0, rowOfNum(squarenumber) + 1) === 9) {numberOfNbrs++}
    if (returnValueIfNotExists(squarenumber + 10, 0, rowOfNum(squarenumber) + 1) === 9) {numberOfNbrs++}

    return numberOfNbrs;
}

function exposeTileIfEmpty(targetNumber, targetRow) {
  if (targetNumber >= 0 && targetNumber < 81) {
    if (confirmSameRow(targetNumber, targetRow)) {
      processClick("c_" + targetNumber);
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
        document.getElementById("c_" + i).classList.add("emojiBox");
        document.getElementById("c_" + i).innerHTML = "💣";
      } else {
        document.getElementById("c_" + i).innerHTML = board[i];
      }
    }
  }
}

var numberColorClasses = ["clear", "one", "two", "three", "four", "five", "six", "seven", "eight"];

function processClick(cellID) {
  if (enableEvents) {
    if (document.getElementById(cellID).innerHTML === "🚩") {
      var confirmation = confirm("Are you sure you would like to select a flagged box?");
      if (confirmation) {
        document.getElementById(cellID).classList.remove("emojiBox");
        document.getElementById(cellID).innerHTML = "";
        processClick(cellID);
      }
    } else {
      tileReveals++;
      document.getElementById("score").innerHTML = String(bombsRemaining).padStart(3, '0');
      var cellNumber = Number(cellID.slice(2));
      if (board[cellNumber] === -1) {
          var cellEle = document.getElementById(cellID);

          let nbrscnt = findNumberOfNbrs(cellNumber);
          board[cellNumber] = nbrscnt;

          if (nbrscnt !== 0) {
              cellEle.innerHTML = nbrscnt;
          } else if (nbrscnt === 0) {
              exposeEmptyArea(cellNumber);
          }
          
          cellEle.classList.add("clear");
          cellEle.classList.add(numberColorClasses[nbrscnt]);
      } else if (board[cellNumber] === 9) {
          console.log("boom.");
          var cellEle = document.getElementById(cellID);
          cellEle.style.backgroundColor = "#f00";

          enableEvents = false;

          revealEntireBoard()

          window.clearInterval(timerInterval);
          throw new Error("game over")
      }
    }
  }
}

function processRightClick(id, event) {
  if (enableEvents) {
    if (document.getElementById(id).innerHTML === "🚩") {
      document.getElementById(id).classList.remove("emojiBox");
      document.getElementById(id).innerHTML = "";
    } else {
      document.getElementById(id).classList.add("emojiBox");
      document.getElementById(id).innerHTML = "🚩";
    }
  }
}

function playGame() {
    //creating elements
    for (var i = 0; i < 81; i++) {
        let gridcell = document.createElement("div");
        gridcell.setAttribute("id", "c_" + i);
        gridcell.classList.add("pgrid-c");
        document.getElementById("ms_grid").appendChild(gridcell);
    }

    //adding bombs, rendering board
    generateBombs();
    populateBoard();

    boardElements = Array.from(document.getElementById("ms_grid").children);

    for (var i = 0; i < 81; i++) {
        boardElements[i].addEventListener("click", function(event) { processClick(this.id); })
        boardElements[i].addEventListener("contextmenu", function(event) { event.preventDefault(); processRightClick(this.id, event); },false);
    }
}