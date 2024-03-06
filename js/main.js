import { lifesCount, updateLifeCount } from './life.js';
import { secondsLeft, timerInterval, currentLevel} from './timer_levels.js';
import { createEnemy, moveEnemies, enemies, createBoss} from './enemy.js';
import { powerShotActive, showBonusSelection, isBonusSelection, autoDestroyEnemies } from './bonuses.js';
import { backgroundMusic, playMusic, playShootSound, playHitSound, playLoseSound } from './audio.js';

const gameArea = document.getElementById('gameArea');

// размер окна игры пропорционален зависимости от размеров экрана
document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('mousedown', shoot);
// document.addEventListener('mouseup', idleFrame);

// Переменные для обновления состояние игры
let spawnRate = 2000;
let lastSpawn = -1;
let bossCreated = false;

function idleFrame() {
    setTimeout(() => {
        gameArea.style.background = "url(images/background1tree.jpg)";
        gameArea.style.backgroundSize = "cover";
        gameArea.style.backgroundPosition = "center";
    }, 200);
}
function shootFrame() {
    gameArea.style.background = "url(images/background2tree.jpg)";
    gameArea.style.backgroundSize = "cover";
    gameArea.style.backgroundPosition = "center";
}

function shoot(event) {
    if (!isBonusSelection) {
        shootFrame();
        playShootSound();
        enemies.forEach((enemyObj, index) => {
            const rect = enemyObj.element.getBoundingClientRect();

            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                // проверка флага
                if (powerShotActive&&enemyObj.hitPoints<=2) {
                    enemyObj.hitPoints = 0; // супер урон(-2)
                } else {
                    enemyObj.hitPoints--;   // обычный урон(-1)
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
            updateLifeCount(-1);
            playHitSound();
            setTimeout(() => {
                if (lifesCount === 0) {
                    gameOver();
                }
            }, 500);
        }
    }
}

export function gameLoop(currentTime) {
    if (currentLevel % 5 != 0) {
        bossCreated=false;
        if (lastSpawn === -1 || currentTime - lastSpawn > (spawnRate - currentLevel * 150)) {
            createEnemy();
            lastSpawn = currentTime;
        }
        moveEnemies();

        if (currentLevel >= 3) {
            autoDestroyEnemies();
        }
    }
    else{
        if (lastSpawn === -1 || currentTime - lastSpawn > spawnRate) {
            createEnemy();
            if(!bossCreated){
                createBoss();
                bossCreated=true;
            }
            lastSpawn = currentTime;
        }
        moveEnemies();
    }

    if (lifesCount > 0 && secondsLeft > 0) {
        requestAnimationFrame(gameLoop);
    }
    else if (lifesCount > 0) {
        showBonusSelection();
    }
}

export function gameOver() {
    backgroundMusic.pause();
    playMusic.textContent = 'MUSIC ON';
    playLoseSound();
    clearInterval(timerInterval);
    localStorage.removeItem('lifesCount');
}

export function gameOver_screen(){
    let gameOver_section = document.createElement('div');
    gameOver_section.className = 'gameover';
    gameOver_section.setAttribute('id', 'gameover');
  
    gameOver_section.innerHTML = `
        <div class="gameover-wrap">
          <h2 class="gameover-title">Better luck next time!</h2>
          <img src="images/gameover.jpg">
          <button id="retry">Press any button</button>
        </div>
    `;
    gameArea.appendChild(gameOver_section);
    document.addEventListener('keydown', function (event) {
        location.reload();
      });
}

document.addEventListener('mousemove', function (e) {
    const dot = document.getElementById('cursorDot');
    var rect = gameArea.getBoundingClientRect();
    // размер окна * 0.9(= размер gameArea) / ширину или высоту 
    let scaleX = gameArea.style.width = window.innerWidth * 0.9 / rect.width;
    let scaleY = gameArea.style.width = window.innerHeight * 0.9 / rect.height;
    dot.style.left = (e.pageX - rect.left) * scaleX + 'px';
    dot.style.top = (e.pageY - rect.top) * scaleY + 'px';
});

class Observer {
    subscribers = [];
    
    broadcast = () => { 
        this.subscribers.forEach(callback => {
            callback(); 
        });
        console.log(this.subscribers.length);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);  
    }
}

let MouseUpObserver = new Observer();
MouseUpObserver.subscribe(() => idleFrame()); 
document.addEventListener('mouseup', () => MouseUpObserver.broadcast());  

requestAnimationFrame(gameLoop);









