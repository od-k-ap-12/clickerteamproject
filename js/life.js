import {gameOver,gameOver_screen} from './main.js';

let lifesCount = 5;
var lifeContainer = document.getElementById('lifeContainer');
var lifeElements = lifeContainer.getElementsByClassName('life');

function updateLifeCount(delta) {
  // обновляем количество жизней и ограничиваем его в пределах от 0 до 5
  lifesCount += delta;
  lifesCount = Math.max(0, Math.min(lifesCount, 5)); // максимальное количество жизней установлено как 5

  // обновляем отображение жизней
  for (let i = 0; i < lifeElements.length; i++) {
      lifeElements[i].style.visibility = i < lifesCount ? 'visible' : 'hidden';
  }

  setTimeout(() => {
      // проверка на окончание игры
      if (lifesCount === 0) {
          gameOver_screen();
          gameOver();
      }

      // обновление переменной в локальном хранилище
      localStorage.setItem('lifesCount', lifesCount.toString());
  }, 500);
}

export { lifesCount, updateLifeCount };