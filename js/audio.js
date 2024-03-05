// Музика на фоні
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.3;

// Звук выстрела
const playShootSound = () => {
  const shootSound = new Audio('./audios/shootSound.mp3');
  shootSound.volume = 0.3;
  shootSound.play();
}

// Звук удара об дерево
const playHitSound = () => {
  const hitSound = new Audio('./audios/hitSound.mp3');
  hitSound.play();
}

const loseSound = new Audio('./audios/loseSound.mp3');

// Звук поразки
const playLoseSound = () => {
  loseSound.volume = 0.5;
  loseSound.play();
}

export { backgroundMusic, playShootSound, playHitSound, playLoseSound };