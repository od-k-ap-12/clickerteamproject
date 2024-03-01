const gameArea = document.getElementById('gameArea');

const gold = document.createElement('div');
gold.setAttribute('id', 'gold');
gold.classList.add('gold'); 

gameArea.appendChild(gold); 

let secondsLeft = 60; 
const timer = document.getElementById('timerContainer');

let lifesCount = 5;
var lifeContainer = document.getElementById('lifeContainer');
var lifeElements = lifeContainer.getElementsByClassName('life');

const enemies = []; 
const enemySpeed = 3;
const spawnRate = 2000; 
let lastSpawn = -1; 

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy'; 

    var spriteEnemy = document.createElement('img');
    spriteEnemy.src = "images/enemy1.png";

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

function moveEnemies() {
    enemies.forEach((enemyObj, index) => {
        const enemy = enemyObj.element; 

        if (enemyObj.xPos < gameArea.offsetWidth / 2) {
            enemyObj.xPos += enemySpeed; 
        } else {
            enemyObj.xPos -= enemySpeed; 
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
        goldsHP--;
        updateGoldsHP();
        if (goldsHP <= 0) {
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
    alert('You Won!');
    clearInterval(timerInterval); 
    window.cancelAnimationFrame(gameInterval); 
}
function gameOver() {
    alert('Game Over!');
    window.cancelAnimationFrame(gameInterval);
}
function updateTimer() {
    if (secondsLeft > 0) {
        secondsLeft--;
        timer.innerHTML = 'Time Left: ' + secondsLeft + ' s';
    } else {
        clearInterval(timerInterval); 
    }
}

const timerInterval = setInterval(updateTimer, 1000); 

function updateLifeCount(lifesCount) {
    // Перевірка на коректність кількості життів
    if(lifesCount == 0 ){
        gameOver();
    }
    else if (lifesCount > 0 && lifesCount <= lifeElements.length) 
    {
        while (lifeElements.length > lifesCount){
            lifeContainer.removeChild(lifeElements[lifeElements.length - 1]);
        }
    }
}

document.addEventListener('mousemove', function(e) {
    const dot = document.getElementById('cursorDot'); 

    dot.style.left = e.pageX + 'px'; 
    dot.style.top = e.pageY + 'px'; 
});

document.addEventListener('mousedown', shoot);

requestAnimationFrame(gameLoop);