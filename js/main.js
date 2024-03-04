// переменные уровней
let currentLevel = 1;
const maxLevel = 5;

const gameArea = document.getElementById('gameArea');

// размер окна игры пропорционален зависимости от размеров экрана
document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
      gameArea.style.width = window.innerWidth * 0.9 + 'px';
      gameArea.style.height = window.innerHeight * 0.9 + 'px'; 
    }
  });
  
const gold = document.createElement('div');
gold.setAttribute('id', 'gold');
gold.classList.add('gold'); 

gameArea.appendChild(gold); 

let secondsLeft = 30; 
const timer = document.getElementById('timerContainer');

let lifesCount = 5;
var lifeContainer = document.getElementById('lifeContainer');
var lifeElements = lifeContainer.getElementsByClassName('life');

const enemies = []; 
const enemySpeed = 3;
// переменная замедляющая врагов(бонус)
let speedDowngrade = 0;
const spawnRate = 2000; 
let lastSpawn = -1;
let animationFrame = 0; 

// супер удар
let powerShotActive = false;

// массив спрайтов врагов
const enemySprites = ["images/enemy1.png", "images/enemy2.png", "images/enemy3.png"];

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy'; 

    var spriteEnemy = document.createElement('img');
    // рандом спрайта для врага
    const randomIndex = Math.floor(Math.random() * enemySprites.length); 
    spriteEnemy.src = enemySprites[randomIndex]; 

    let yPos = gameArea.offsetHeight / 2 - (Math.floor(Math.random() * 10) + 67); 
    enemy.style.top = yPos + 'px'; 

    let x = Math.random();

    if(x < 0.5){
        xPos = -100;
        spriteEnemy.style.transform = 'scaleX(-1)';
    }
    else{
        xPos = gameArea.offsetWidth - 30;
        spriteEnemy.style.transform = 'scaleX(1)';
    }

    enemy.style.left = xPos + 'px';
    enemy.appendChild(spriteEnemy);
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, xPos: xPos, yPos: yPos, hitPoints: 2 });
}

function idleFrame(){
    gameArea.style.background="url(images/background2.jpg)";
    gameArea.style.backgroundSize="cover";
    gameArea.style.backgroundPosition= "center";
}

function shootFrame(){
    setTimeout(()=>{
        gameArea.style.background="url(images/background1.jpg)";
        gameArea.style.backgroundSize="cover";
        gameArea.style.backgroundPosition= "center";
    },200);
}

function moveEnemies() {
    // изменение скорости в зависимости от уровня и приминения бонуса
    const levelSpeed = (enemySpeed - speedDowngrade) + (currentLevel - 1) * 0.5; 

    enemies.forEach((enemyObj, index) => {
        const enemy = enemyObj.element; 

        if (enemyObj.xPos < gameArea.offsetWidth / 2) {
            enemyObj.xPos += levelSpeed; 
        } else {
            enemyObj.xPos -= levelSpeed; 
        }
        enemy.style.left = enemyObj.xPos + 'px';

        if (
            Math.abs((enemyObj.xPos + 20) - (gameArea.offsetWidth / 2 - gold.offsetWidth)) < 70 && 
            Math.abs(enemyObj.yPos - (gameArea.offsetHeight / 2 - gold.offsetHeight)) < 70  
        ){
            lifesCount--; 
            updateLifeCount(lifesCount);

            enemy.remove(); 
            enemies.splice(index, 1); 
        }
    });
}

function shoot(event) {
    idleFrame();
    enemies.forEach((enemyObj, index) => {
        const rect = enemyObj.element.getBoundingClientRect();

        if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        ) {
            // проверка флага
            if (powerShotActive) {
                enemyObj.hitPoints = 0; // супер урон(-2)
            } else {
                enemyObj.hitPoints--; // обычный урон(-1)
            }

            if (enemyObj.hitPoints <= 0) {
                enemyObj.element.remove();
                enemies.splice(index, 1);
            } else {
                enemyObj.element.style.opacity = enemyObj.hitPoints / 2;
            }
        }
    });

    const goldRect = gold.getBoundingClientRect();
    if (
        event.clientX >= goldRect.left &&
        event.clientX <= goldRect.right &&
        event.clientY >= goldRect.top &&
        event.clientY <= goldRect.bottom
    ) {
        lifesCount--;
        updateLifeCount(lifesCount);
        if (lifesCount <= 0) {
            gameOver();
        }
    }
}

function gameLoop(currentTime) {
    if (lastSpawn === -1 || currentTime - lastSpawn > spawnRate) {
        createEnemy(); 
        lastSpawn = currentTime;
    }
    moveEnemies();

    if (lifesCount > 0 && secondsLeft > 0) {
        requestAnimationFrame(gameLoop); 
    } else if (lifesCount > 0) { 
        winGame(); 
    }
}

function winGame() {
    if (currentLevel < maxLevel) {
        showBonusSelection();
    } else {
        alert('YOU WON IT! YOU SAVE IT! YOU DONE IT!');
        clearInterval(timerInterval);
        window.cancelAnimationFrame(animationFrame);
        localStorage.removeItem('lifesCount');
    }
}

function gameOver() {
    alert('Game Over!');
    window.cancelAnimationFrame(gameInterval);
    localStorage.removeItem('lifesCount'); 
}

function updateTimer() {
    if (secondsLeft > 0) {
        secondsLeft--;
        document.getElementById('timeLeft').textContent = ': ' + secondsLeft + ' s';
    } else {
        clearInterval(timerInterval); 
    }
}

let timerInterval = setInterval(updateTimer, 1000); 

function updateLifeCount(lifesCount) {
    if (lifesCount == 0) {
        gameOver();
    } else if (lifesCount > 0 && lifesCount <= lifeElements.length) {
        while (lifeElements.length > lifesCount) {
            lifeContainer.removeChild(lifeElements[lifeElements.length - 1]);
        }
    }

    // хранение переменной в локальном хранилище на протяжении всех уровней
    localStorage.setItem('lifesCount', lifesCount);
}

document.addEventListener('mousemove', function(e) {
    const dot = document.getElementById('cursorDot'); 
    var rect = gameArea.getBoundingClientRect();
    // размер окна * 0.9(= размер gameArea) / ширину или высоту 
    scaleX = gameArea.style.width = window.innerWidth * 0.9 / rect.width,
    scaleY = gameArea.style.width = window.innerHeight * 0.9 / rect.height;
    dot.style.left = (e.pageX - rect.left) * scaleX + 'px'; 
    dot.style.top = (e.pageY - rect.top) * scaleY + 'px'; 
});

document.addEventListener('mousedown', shoot);
document.addEventListener('mouseup', shootFrame);

requestAnimationFrame(gameLoop);

// ! БЛОК НОВЫХ МЕТОДОВ

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
                // ... почему то не работает
                lifesCount++; 

                /* ! ПРОСЬБА : СДЕЛАЙТЕ ЧТОБЫ ЭТА ШТУКА ВИЗУАЛЬНО ДОБАВЛЯЛАСЬ

                    <div id="lifeContainer">
                        <div class="life">
                            <img src="images/heart.png">
                        </div>
                    </div>
                */

                //localStorage.setItem('lifesCount', lifesCount);
            }
            break;
    }
}

function moveToNextLevel() {
    secondsLeft = 30;
    timerInterval = setInterval(updateTimer, 1000);
    currentLevel++;
    requestAnimationFrame(gameLoop);
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






