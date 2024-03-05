import { lifesCount, updateLifeCount } from './life.js';
import { secondsLeft, timerInterval, currentLevel, maxLevel } from './timer_levels.js';
import { createEnemy, moveEnemies, enemies } from './enemy.js';
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
    //backgroundMusic.play();
});

const gold = document.createElement('div');
gold.setAttribute('id', 'gold');
gold.classList.add('gold');

gameArea.appendChild(gold);

// Переменные для обновления состояние игры
let spawnRate = 2000;
let lastSpawn = -1;
let animationFrame = 0;


function idleFrame() {
    setTimeout(() => {
        gameArea.style.background = "url(images/background1.jpg)";
        gameArea.style.backgroundSize = "cover";
        gameArea.style.backgroundPosition = "center";
    }, 200);
}
function shootFrame() {
    gameArea.style.background = "url(images/background2.jpg)";
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
                if (powerShotActive) {
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

    if (lastSpawn === -1 || currentTime - lastSpawn > (spawnRate - currentLevel * 250)) {
        createEnemy();
        lastSpawn = currentTime;
    }
    moveEnemies();

    if (currentLevel >= 3) {
        autoDestroyEnemies(); 
    }

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
        localStorage.removeItem('lifesCount');

        currentLevel = 1;
        speedDowngrade = 0;
        updateLifeCount(5);
        powerShotActive = false;
        secondsLeft = 30;
        timerInterval = setInterval(updateTimer, 1000);
        requestAnimationFrame(gameLoop);
    }
}

export function gameOver() {
    backgroundMusic.pause();
    playMusic.textContent = 'MUSIC ON';
    playLoseSound();
    clearInterval(timerInterval);
    //alert('Game Over!');         // alert блокує програвач аудіо
    localStorage.removeItem('lifesCount');

    currentLevel = 1;
    speedDowngrade = 0;
    updateLifeCount(5);
    powerShotActive = false;
    secondsLeft = 30;
    timerInterval = setInterval(updateTimer, 1000);
    requestAnimationFrame(gameLoop);
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

document.addEventListener('mousedown', shoot);
document.addEventListener('mouseup', idleFrame);

requestAnimationFrame(gameLoop);








