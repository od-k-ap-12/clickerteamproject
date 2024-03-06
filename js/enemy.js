import { currentLevel } from './timer_levels.js';
import { updateLifeCount } from './life.js';
import { speedDowngrade } from './bonuses.js';
import { playHitSound } from './audio.js';

const enemies = [];
const enemySpeed = 3;

// массив спрайтов врагов
const enemySprites = ["images/enemy1.png", "images/enemy2.png", "images/enemy3.png"];

class Enemy{
    constructor(){
        this.hitPoints=2;
        this.Speed=3;
    }
}

function EnemyFactory(){
     let enemy=new Enemy();
     // рандом спрайта для врага
     enemy.spriteIndex = Math.floor(Math.random() * enemySprites.length);
     return enemy;
}

function createEnemy() {
    let enemyObj=EnemyFactory();
    let enemy = document.createElement('div');
    enemy.className = 'enemy';

    var spriteEnemy = document.createElement('img');
    spriteEnemy.src = enemySprites[enemyObj.spriteIndex];

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
    enemies.push({ element: enemy, xPos: xPos, yPos: yPos, hitPoints: enemyObj.hitPoints });
}

function createBoss() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.classList.add('boss');
    
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
    enemies.push({ element: enemy, xPos: xPos, yPos: yPos, hitPoints: 30 });
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

export { createEnemy, moveEnemies, enemies, createBoss };