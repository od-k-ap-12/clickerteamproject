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
const spawnRate = 2000; 
let lastSpawn = -1;
let animationFrame = 0; 

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
    // изменение скорости в зависимости от уровня
    const levelSpeed = enemySpeed + (currentLevel - 1) * 0.5; 

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
            enemyObj.hitPoints--;
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
        alert('Level №' + currentLevel + ' complete! Next one is comming');
        currentLevel++;
        secondsLeft = 30; 
        requestAnimationFrame(gameLoop);
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

const timerInterval = setInterval(updateTimer, 1000); 

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
      scaleX = 1200 / rect.width,
      scaleY = document.body.scrollHeight / rect.height;
    dot.style.left = (e.pageX - rect.left) * scaleX + 'px'; 
    dot.style.top = (e.pageY - rect.top) * scaleY + 'px'; 
});

document.addEventListener('mousedown', shoot);
document.addEventListener('mouseup', shootFrame);

requestAnimationFrame(gameLoop);