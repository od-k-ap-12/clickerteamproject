const gameArea = document.getElementById('gameArea');

const gold = document.createElement('div');
gold.setAttribute('id', 'gold');
gold.classList.add('gold'); 

gameArea.appendChild(gold); 

let secondsLeft = 60; 
const timer = document.getElementById('timer'); 

let goldsHP = 5; 
updateGoldsHP(); 

const enemies = []; 
const enemySpeed = 1;
const spawnRate = 2000; 
let lastSpawn = -1; 

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.className = 'enemy'; 

    let yPos = gameArea.offsetHeight / 2 - 15; 
    enemy.style.top = yPos + 'px'; 

    let xPos = Math.random() < 0.5 ? 0 : gameArea.offsetWidth - 30; 
    enemy.style.left = xPos + 'px'; 

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
            Math.abs(enemyObj.xPos - (gameArea.offsetWidth / 2 - gold.offsetWidth / 2)) < 30 && 
            Math.abs(enemyObj.yPos - (gameArea.offsetHeight / 2 - gold.offsetHeight / 2)) < 30  
        ) {
            goldsHP--; 
            updateGoldsHP(); 

            enemy.remove(); 
            enemies.splice(index, 1); 

            if (goldsHP <= 0) {
                gameOver(); 
            }
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

    if (goldsHP > 0 && secondsLeft > 0) {
        requestAnimationFrame(gameLoop); 
    } else if (goldsHP > 0) { 
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
        timer.innerHTML = 'Seconds Left: ' + secondsLeft;
    } else {
        clearInterval(timerInterval); 
    }
}
const timerInterval = setInterval(updateTimer, 1000); 

function updateGoldsHP() {
    const HP = document.getElementById('goldsHP');
    HP.innerHTML = 'HP: ' + goldsHP;
    if (goldsHP <= 0) {
        gameOver();
    }
}

document.addEventListener('mousemove', function(e) {
    const dot = document.getElementById('cursorDot'); 

    dot.style.left = e.pageX + 'px'; 
    dot.style.top = e.pageY + 'px'; 
});
document.addEventListener('mousedown', shoot);

requestAnimationFrame(gameLoop);