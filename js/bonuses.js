import { lifesCount, updateLifeCount } from "./life.js";
import { moveToNextLevel } from "./timer_levels.js";

let isBonusSelection = false;

let speedDowngrade = 0;   //замедление врагов

let powerShotActive = false;   // супер удар

function applyBonus(bonus) {
  switch (bonus) {
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
  isBonusSelection = false;
}

function showBonusSelection() {
  isBonusSelection = true;
  // создание и стилизация элемента выбора плюшек
  const bonusSelection = document.createElement('div');
  bonusSelection.className = 'bonusSelection';
  bonusSelection.setAttribute('id', 'bonusSelection');

  bonusSelection.innerHTML = `
      <h2 class="bonusTitle">Choose Your Bonus:</h2>
      <div class="container">
        <div class="bonus-container">
            <button class="bonusButton" data-bonus="slowEnemies">
                <img src="images/boost1.png">
            </button>
            <p class="bonusName">Slow down enemies</p>
        </div>
        <div class="bonus-container">
            <button class="bonusButton" data-bonus="extraLife">
                <img src="images/boost2.png">
            </button>
            <p class="bonusName">Extra life</p>
        </div>
        <div class="bonus-container">
            <button class="bonusButton" data-bonus="powerShot">
                <img src="images/target.png">
            </button>
            <p class="bonusName">Power shot</p>
        </div>
      </div>
  `;

  // добавляем bonusSelection в gameArea
  gameArea.appendChild(bonusSelection);
  // добавляем обработчики для кнопок выбора плюшек
  document.querySelectorAll('.bonusButton').forEach(button => {
    button.addEventListener('click', function () {
      applyBonus(this.getAttribute('data-bonus'));  // применяем выбранный бонус
      bonusSelection.remove();
      moveToNextLevel();
    });
  });
}

export { powerShotActive, speedDowngrade, showBonusSelection, isBonusSelection };
