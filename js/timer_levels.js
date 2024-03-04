import { gameLoop } from './main.js';

let secondsLeft = 30;
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
  secondsLeft = 30;
  timerInterval = setInterval(updateTimer, 1000);
  currentLevel++;
  requestAnimationFrame(gameLoop);
}

export { secondsLeft, timerInterval, currentLevel, maxLevel, moveToNextLevel }