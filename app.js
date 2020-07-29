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

    // Calculate total number of bombs in proximity to each square
    for (let i = 0; i < game.length; i++) {
      let total = 0;
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width -1);

      if (game[i].classList.contains('valid')) {
        // Check all neighbors of current square
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
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩️';
        flags++;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags --;
      }
    }
  }

  // click on square actions
  function click(square) {
    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;
      
    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('checked');
        square.innerHTML = total;
        return;
      }
      checkSquare(square);
    }
    square.classList.add('checked');
  }

  // Check neighboring squares once square is clicked
  function checkSquare(square) {
    const currentId = square.id;
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        // Left
        const newId = game[parseInt(currentId) -1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        // Top right
        const newId = game[parseInt(currentId) +1 -width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        // Top
        const newId = game[parseInt(currentId -width)].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        // Top left
        const newId = game[parseInt(currentId) -1 -width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        // Bottom right
        const newId = game[parseInt(currentId) +1 +width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        // Bottom
        const newId = game[parseInt(currentId) +width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        // Bottom left
        const newId = game[parseInt(currentId) -1 +width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        // Right
        const newId = game[parseInt(currentId) +1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  function gameOver() {
    result.innerHTML = 'BOOM! Game Over';
    isGameOver = true;

    showAllBombs();
  }

  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < game.length; i++) {
      if (game[i].classList.contains('flag') && game[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!';
        isGameOver = true;
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

});
