// import { createBoss } from './enemy.js';
import { gameLoop } from './main.js';

let secondsLeft = 10;
let timerInterval = setInterval(updateTimer, 1000);

// Переменные уровней
let currentLevel = 1;

function updateTimer() {
  if (secondsLeft > 0) {
      secondsLeft--;
      document.getElementById('timeLeft').textContent = ': ' + secondsLeft + ' s';
  } else {
      clearInterval(timerInterval);
  }
}

function moveToNextLevel() {
  secondsLeft = 10;
  timerInterval = setInterval(updateTimer, 1000);
  currentLevel++;
  document.getElementById('level').textContent = 'Level: ' + currentLevel;
  
  if (currentLevel % 5 == 0){
    // createBoss();
    secondsLeft = 60;
  }
  requestAnimationFrame(gameLoop);
}

export { secondsLeft, timerInterval, currentLevel, moveToNextLevel }