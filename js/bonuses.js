import { lifesCount, updateLifeCount } from "./life.js";
import { moveToNextLevel } from "./timer_levels.js";

//замедление врагов
let speedDowngrade = 0;

// супер удар
let powerShotActive = false;

//! НА МОМЕНТ ВЫБОРА БУСТА ИГОВОЕ ПОЛОТНО ДОЛЖНО БЛОКИРОВАТЬСЯ - НУЖНО СДЕЛАТЬ !!!
// (комент залишаю, хоча цієї проблеми не помітила)
function applyBonus(bonus) {
  switch(bonus) {
      case 'slowEnemies':
          speedDowngrade += 0.8; // при желании играйтесь со значением
          break;
      case 'powerShot':
          powerShotActive = true;
          break;
      case 'extraLife':
          if (lifesCount < 5) {
              updateLifeCount(1)
          }
          break;
  }
}

function showBonusSelection() {
  // создание и стилизация элемента выбора плюшек
  const bonusSelection = document.createElement('div');
  bonusSelection.setAttribute('id', 'bonusSelection');
  bonusSelection.style.position = 'absolute';
  bonusSelection.style.left = '50%';
  bonusSelection.style.top = '50%';
  bonusSelection.style.transform = 'translate(-50%, -50%)';
  bonusSelection.style.background = 'rgba(0, 0, 0, 0.8)';
  bonusSelection.style.color = 'white';
  bonusSelection.style.padding = '20px';
  bonusSelection.style.borderRadius = '10px';
  bonusSelection.style.textAlign = 'center';
  bonusSelection.innerHTML = `
      <h2>Choose Your Bonus:</h2>
      <button class="bonusButton" data-bonus="slowEnemies">Slow Down Enemies</button>
      <button class="bonusButton" data-bonus="extraLife">Extra Life</button>
      <button class="bonusButton" data-bonus="powerShot">Power Shot</button>
  `;
  
  // добавляем bonusSelection в gameArea
  gameArea.appendChild(bonusSelection);
  
  // добавляем обработчики для кнопок выбора плюшек
  document.querySelectorAll('.bonusButton').forEach(button => {
      button.addEventListener('click', function() {
          // применяем выбранный бонус
          applyBonus(this.getAttribute('data-bonus'));
          // удаляем элемент выбора плюшек после выбора
          bonusSelection.remove();
          // переходим на следующий уровень
          moveToNextLevel();
      });
  });
}
export {powerShotActive, speedDowngrade, showBonusSelection};
