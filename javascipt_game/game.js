const canvas = document.getElementById('game-map');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  speed: 5,
};

let chaser = {
  x: 100,
  y: 100,
  width: 30,
  height: 30,
  speed: 1,
};

let gameStarted = false;
let scatteredLetters = [];
let randomWord = "HAUNTED";
let collectedLetters = [];
let letterOutOfOrderAlerted = false;

// Generate non-overlapping random positions for letters
function generateLetters() {
  scatteredLetters = [];
  for (let i = 0; i < randomWord.length; i++) {
    let x, y, overlap;
    do {
      x = Math.random() * (canvas.width - 50);
      y = Math.random() * (canvas.height - 50);
      overlap = scatteredLetters.some(
        letter => Math.abs(letter.x - x) < 40 && Math.abs(letter.y - y) < 40
      );
    } while (overlap);
    scatteredLetters.push({ letter: randomWord[i], x, y });
  }
}

// Draws the game character
function drawCharacter() {
  ctx.fillStyle = '#3b5';
  ctx.fillRect(character.x, character.y, character.width, character.height);
}

// Draws the chaser
function drawChaser() {
  ctx.fillStyle = '#d33';
  ctx.fillRect(chaser.x, chaser.y, chaser.width, chaser.height);
}

// Draws the map background
function drawMap() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(750, 50);
  ctx.lineTo(750, 550);
  ctx.lineTo(50, 550);
  ctx.closePath();
  ctx.stroke();
}

// Move chaser towards character
function moveChaser() {
  const dx = character.x - chaser.x;
  const dy = character.y - chaser.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    chaser.x += (dx / distance) * chaser.speed;
    chaser.y += (dy / distance) * chaser.speed;
  }
}

// Handle character movement
function moveCharacter(e) {
  if (gameStarted) {
    switch (e.key) {
      case 'ArrowUp':
        if (character.y > 0) character.y -= character.speed;
        break;
      case 'ArrowDown':
        if (character.y + character.height < canvas.height) character.y += character.speed;
        break;
      case 'ArrowLeft':
        if (character.x > 0) character.x -= character.speed;
        break;
      case 'ArrowRight':
        if (character.x + character.width < canvas.width) character.x += character.speed;
        break;
    }
  }
}

// Draw letters to collect
function drawLetters() {
  scatteredLetters.forEach(({ letter, x, y }) => {
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.fillText(letter, x + 5, y + 20);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 30, 30);
  });
}

// Display the target word in the top-center

// Display the target word in the top-right corner
function displayTargetWord() {
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    const text = 'Collect: ' + randomWord;
    const textWidth = ctx.measureText(text).width;
    
    // Adjust x and y positions to keep text inside canvas bounds
    const xPos = canvas.width - textWidth - 20;  // 20px padding from the right edge
    const yPos = 50;  // Adjusted from 30 to 50 to move it down slightly
  
    ctx.fillText(text, xPos, yPos);
  }
  


// Check letter collection and game progress
function checkLetterCollection() {
  scatteredLetters.forEach((item, index) => {
    if (
      character.x < item.x + 20 &&
      character.x + character.width > item.x &&
      character.y < item.y + 20 &&
      character.y + character.height > item.y
    ) {
      if (item.letter === randomWord[collectedLetters.length]) {
        collectedLetters.push(item.letter);
        scatteredLetters.splice(index, 1);
        letterOutOfOrderAlerted = false;
      } else if (!letterOutOfOrderAlerted) {
        alert("Collect letters in order!");
        letterOutOfOrderAlerted = true;
      }
    }
  });

  if (collectedLetters.join('') === randomWord) {
    alert("You won! Word formed: " + randomWord);
    resetGame();
  }
}

// Check game over condition
function checkGameOver() {
  if (
    chaser.x < character.x + character.width &&
    chaser.x + chaser.width > character.x &&
    chaser.y < character.y + character.height &&
    chaser.y + chaser.height > character.y
  ) {
    alert("Game Over! The chaser caught you!");
    resetGame();
  }
}

// Main game loop
function gameLoop() {
  if (gameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawCharacter();
    drawChaser();
    moveChaser();
    drawLetters();
    displayTargetWord();
    checkLetterCollection();
    checkGameOver();
    requestAnimationFrame(gameLoop); // Use requestAnimationFrame for smooth animation
  }
}

// Reset game to initial state
function resetGame() {
  character.x = canvas.width / 2;
  character.y = canvas.height / 2;
  chaser.x = 100;
  chaser.y = 100;
  collectedLetters = [];
  letterOutOfOrderAlerted = false;
  generateLetters();
  if (gameStarted) {
    gameLoop();
  }
}

// Start the game on "Start Game" button click
document.getElementById('start-game').addEventListener('click', () => {
  gameStarted = true;
  generateLetters();
  gameLoop();
  document.getElementById('start-game').style.display = 'none';
  document.getElementById('restart').style.display = 'block';
});

// Reload the game on "Restart" button click
document.getElementById('restart').addEventListener('click', () => {
  resetGame();
});

window.addEventListener('keydown', moveCharacter);
