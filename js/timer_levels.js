import { gameLoop } from './main.js';

let secondsLeft = 10;   // повернути на 30 назад
let timerInterval = setInterval(updateTimer, 1000);

// Переменные уровней
let currentLevel = 1;
const maxLevel = 5;

function updateTimer() {
  if (secondsLeft > 0) {
      secondsLeft--;
      document.getElementById('timeLeft').textContent = ': ' + secondsLeft + ' s';
  } else {
      clearInterval(timerInterval);
  }
}

function moveToNextLevel() {
  secondsLeft = 10;  // повернути на 30 назад
  timerInterval = setInterval(updateTimer, 1000);
  currentLevel++;
  requestAnimationFrame(gameLoop);
}

export { secondsLeft, timerInterval, currentLevel, maxLevel, moveToNextLevel }