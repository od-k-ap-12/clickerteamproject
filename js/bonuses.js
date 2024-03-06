import { lifesCount, updateLifeCount } from "./life.js";
import { currentLevel, moveToNextLevel } from "./timer_levels.js";
import { enemies } from "./enemy.js";
import { playBonusSound, playShootSound } from "./audio.js";

let isBonusSelection = false;

let speedDowngrade = 0;   //замедление врагов

let powerShotActive = false;   // супер удар

function applyBonus(bonus) {
  switch (bonus) {
    case 'slowEnemies':
      speedDowngrade += 1; // при желании играйтесь со значением
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
                <img src="images/speeddown.png">
            </button>
            <p class="bonusName">Slow down enemies</p>
        </div>
        <div class="bonus-container">
            <button class="bonusButton" data-bonus="extraLife">
                <img src="images/extralife.png">
            </button>
            <p class="bonusName">Extra life</p>
        </div>
        <div class="bonus-container">
            <button class="bonusButton" data-bonus="powerShot">
                <img src="images/doubledamage.png">
            </button>
            <p class="bonusName">Power shot</p>
        </div>
      </div>
  `;
  gameArea.appendChild(bonusSelection); // добавляем bonusSelection в gameArea

  // создание и стилизация элемента подсказки к появлению автоклика
  const autoClickTip = document.createElement('div');
    autoClickTip.className = 'tip';
    autoClickTip.setAttribute('id', 'autoClickTip');

    autoClickTip.innerHTML = `
      <div class="autoClickTip">
        <h3>Congratulations!</h3>
        <p>From level 3 you unlocked the ability to use <span>autoclick<span>. 
        <p>It should help you a lot.</p>
        <p>But don't stop keeping attention to your enemies.</p>
        <p>Good luck!</p>
      </div>
    `;

  if(currentLevel == 2){
    gameArea.appendChild(autoClickTip); // добавляем autoClickTip в gameArea
  }

  // добавляем обработчики для кнопок выбора плюшек
  document.querySelectorAll('.bonusButton').forEach(button => {
    button.addEventListener('click', function () {
      playBonusSound();
      applyBonus(this.getAttribute('data-bonus'));  // применяем выбранный бонус
      bonusSelection.remove();
      autoClickTip.remove();
      moveToNextLevel();
    });
  });

}

// Автоклік - відкривається з 3-го рівня
function autoDestroyEnemies() {
  enemies.forEach((enemyObj, index) => {
    if (currentLevel % 5 !== 0) 
    {
      if (Math.random() < (0.005 + currentLevel * 0.001)) // можно играться со значением при желании
      {
        enemyObj.hitPoints = 0;
        enemyObj.element.remove();
        playShootSound();
        enemies.splice(index, 1);
      }
    }
    else{
      if (Math.random() < 0.1) // більша ймовірність вбити маленьку тварюку
      {
        enemyObj.hitPoints = 0;
        enemyObj.element.remove();
        playShootSound();
        enemies.splice(index, 1);
      }
    }
  });
}

export { powerShotActive, speedDowngrade, showBonusSelection, isBonusSelection, autoDestroyEnemies };
