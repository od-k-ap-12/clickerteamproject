import { currentLevel } from './timer_levels.js';
import { updateLifeCount } from './life.js';
import { speedDowngrade } from './bonuses.js';
import { playHitSound } from './audio.js';

const enemies = [];
const enemySpeed = 3;

// массив спрайтов врагов
const enemySprites = ["images/enemy1.png", "images/enemy2.png", "images/enemy3.png"];

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy';

    var spriteEnemy = document.createElement('img');
    // рандом спрайта для врага
    const randomIndex = Math.floor(Math.random() * enemySprites.length);
    spriteEnemy.src = enemySprites[randomIndex];

    let yPos = gameArea.offsetHeight / 2 - (Math.floor(Math.random() * 10) + 95);
    enemy.style.top = yPos + 'px';

    let x = Math.random(), xPos;

    if (x < 0.5) {
        xPos = -200;
        spriteEnemy.style.transform = 'scaleX(-1)';
    }
    else {
        xPos = gameArea.offsetWidth - 30;
        spriteEnemy.style.transform = 'scaleX(1)';
    }

    enemy.style.left = xPos + 'px';
    enemy.appendChild(spriteEnemy);
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, xPos: xPos, yPos: yPos, hitPoints: 2 });
}

function createBoss() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.classList.add('boss');
    // enemy.classList.add('enemy');
    console.log(enemy.classList.contains('boss'));
    var spriteEnemy = document.createElement('img');

    spriteEnemy.src = "images/boss.png";

    let yPos = gameArea.offsetHeight / 2 - (Math.floor(Math.random() * 10) + 95);
    enemy.style.top = yPos-100 + 'px';

    let x = Math.random(), xPos;

    if (x < 0.5) {
        xPos = -200;
        spriteEnemy.style.transform = 'scaleX(-1)';
    }
    else {
        xPos = gameArea.offsetWidth - 30;
        spriteEnemy.style.transform = 'scaleX(1)';
    }

    enemy.style.left = xPos + 'px';
    enemy.appendChild(spriteEnemy);
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, xPos: xPos, yPos: yPos, hitPoints: 50 });
}

function moveEnemies() {
    // изменение скорости в зависимости от уровня и приминения бонуса
    const bossSpeed =1;
    const levelSpeed = (enemySpeed - speedDowngrade) + (currentLevel - 1) * 1.5;

    enemies.forEach((enemyObj, index) => {
        const enemy = enemyObj.element;

        if (enemyObj.xPos < gameArea.offsetWidth / 2) {
            if(enemy.classList.contains('boss')){
                enemyObj.xPos += bossSpeed;
            }
            else{
                enemyObj.xPos += levelSpeed;
            }
        }
        else {
            if(enemy.classList.contains('boss')){
                enemyObj.xPos -= bossSpeed;
            }
            else{
                enemyObj.xPos -= levelSpeed;
            }
        }
        enemy.style.left = enemyObj.xPos + 'px';

        if (
            Math.abs((enemyObj.xPos + 20) - (gameArea.offsetWidth / 2 - gold.offsetWidth)) < 70 &&
            Math.abs(enemyObj.yPos - (gameArea.offsetHeight / 2 - gold.offsetHeight)) < 70
        ) {
            if(enemy.classList.contains('boss')){
                updateLifeCount(-5);
            }
            else{
                updateLifeCount(-1);
            }
            playHitSound();
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}

// Те ж саме для боса

// let boss = document.createElement('div');
// boss.className = 'boss';

// function createBoss() {
//     let boss = document.createElement('div');
//     boss.className = 'boss';
//     boss.hitPoints = 100;   // можливо це не так виставляється

//     var spriteBoss = document.createElement('img');
//     spriteBoss.src = './images/enemy3.png';   // сюди спрайт босса

//     let yPos = gameArea.offsetHeight / 2 - (Math.floor(Math.random() * 10) + 95);
//     boss.style.top = yPos + 'px';

//     let x = Math.random(), xPos;

//     if (x < 0.5) {
//         xPos = -200;
//         boss.style.transform = 'scaleX(-1)';
//     }
//     else {
//         xPos = gameArea.offsetWidth - 30;
//         boss.style.transform = 'scaleX(1)';
//     }

//     boss.style.left = xPos + 'px';
//     boss.appendChild(spriteBoss);
//     gameArea.appendChild(boss);
// }

// function moveBoss() {
//     // швидкість для боса
//     const levelSpeed = 0.1;

//     if (boss.xPos < gameArea.offsetWidth / 2) {
//         boss.xPos += levelSpeed;
//     }
//     else {
//         boss.xPos -= levelSpeed;
//     }
//     boss.style.left = boss.xPos + 'px';

//     if (
//         Math.abs((boss.xPos + 20) - (gameArea.offsetWidth / 2 - gold.offsetWidth)) < 70 &&
//         Math.abs(boss.yPos - (gameArea.offsetHeight / 2 - gold.offsetHeight)) < 70
//     ) {
//         playHitSound();
//         updateLifeCount(-5); // одразу програш, якщо бос дійде до дерева
//     }
// }

export { createEnemy, moveEnemies, enemies, createBoss };