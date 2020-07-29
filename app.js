document.addEventListener('DOMContentLoaded', () => {
  const board = document.querySelector('.board');
  const result = document.querySelector('.result');
  let width = 10;
  let boardSize = width * width;
  let bombAmount = 20;
  let flags = 0;
  let game = [];
  let isGameOver = false;

  // TODO: Add: title, flags, maybe a timer, etc...
  
  // Create Board
  function createBoard() {
    result.innerHTML = '';
    // Get shuffled game array with random bombs
    const bombCells = Array(bombAmount).fill('bomb');
    const validCells = Array(boardSize - bombAmount).fill('valid');
    const totalSpaces = validCells.concat(bombCells);
    const shuffled = totalSpaces.sort(() => Math.random() -0.5);

    // What is this doing exactly?
    for (let i = 0; i < boardSize; i++) {
      const cell = document.createElement('div');
      cell.setAttribute('id', i);
      cell.classList.add(shuffled[i]);

      board.appendChild(cell);
      game.push(cell);

      // Normal (left) click
      cell.addEventListener('click', function(e) {
        click(cell);
      });

      // Right click
      cell.oncontextmenu = function(e) {
        e.preventDefault();
        addFlag(cell);
      }
    }

    // Calculate total number of bombs in proximity to each cell
    for (let i = 0; i < game.length; i++) {
      let total = 0;
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width -1);

      if (game[i].classList.contains('valid')) {
        // Check all neighbors of current cell
        // Left
        if (i > 0 && !isLeftEdge && game[i -1].classList.contains('bomb')) total++;
        // Top right
        if (i > 9 && !isRightEdge && game[i +1 -width].classList.contains('bomb')) total++;
        // Top
        if (i > 10 && game[i - width].classList.contains('bomb')) total++;
        // Top left
        if (i > 11 && !isLeftEdge && game[i -1 - width].classList.contains('bomb')) total++;
        // Bottom right
        if (i < 88 && !isRightEdge && game[i +1 + width].classList.contains('bomb')) total++;
        // Bottom
        if (i < 89 && game[i + width].classList.contains('bomb')) total++; 
        // Bottom left
        if (i < 90 && !isLeftEdge && game[i -1 + width].classList.contains('bomb')) total++;
        // Right
        if (i < 98 && !isRightEdge && game[i +1].classList.contains('bomb')) total++;
        game[i].setAttribute('data', total);
      }
    }

  }

  createBoard();

  // Add Flag with right click
  function addFlag(cell) {
    if (isGameOver) return;
    if (!cell.classList.contains('checked') && (flags < bombAmount)) {
      if (!cell.classList.contains('flag')) {
        cell.classList.add('flag');
        cell.innerHTML = '🚩️';
        flags++;
        checkForWin();
      } else {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        flags --;
      }
    }
  }

  // click on square actions
  function click(cell) {
    if (isGameOver) return;
    if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
      
    if (cell.classList.contains('bomb')) {
      playerLost();
    } else {
      let total = cell.getAttribute('data');
      if (total != 0) {
        cell.classList.add('checked');
        cell.innerHTML = total;
        return;
      }
      checkCell(cell);
    }
    cell.classList.add('checked');
  }

  // Check neighboring squares once square is clicked
  function checkCell(cell) {
    const currentId = cell.id;
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        // Left
        const newId = game[parseInt(currentId) -1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId > 9 && !isRightEdge) {
        // Top right
        const newId = game[parseInt(currentId) +1 -width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId > 10) {
        // Top
        const newId = game[parseInt(currentId -width)].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId > 11 && !isLeftEdge) {
        // Top left
        const newId = game[parseInt(currentId) -1 -width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId < 88 && !isRightEdge) {
        // Bottom right
        const newId = game[parseInt(currentId) +1 +width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId < 89) {
        // Bottom
        const newId = game[parseInt(currentId) +width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId < 90 && !isLeftEdge) {
        // Bottom left
        const newId = game[parseInt(currentId) -1 +width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (currentId < 98 && !isRightEdge) {
        // Right
        const newId = game[parseInt(currentId) +1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
    }, 10);
  }


  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < game.length; i++) {
      const cellHasBomb = game[i].classList.contains('flag');
      const cellHasFlag = game[i].classList.contains('bomb');

      if (cellHasBomb && cellHasFlag) {
        matches++;
      }

      const allBombsAreFlagged = matches === bombAmount;

      if (allBombsAreFlagged) {
        playerWon();
      }
    }
  }

  function showAllBombs() {
    game.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣️';
      }
    })
  }

  function playerWon() {
    result.innerHTML = 'YOU WIN!';
    gameOver();
  }

  function playerLost() {
    result.innerHTML = 'BOOM! Game Over';
    showAllBombs();
  }

  function gameOver() {
    isGameOver = true;
  }

});
