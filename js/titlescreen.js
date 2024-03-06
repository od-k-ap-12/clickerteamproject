const titlescreen = document.getElementById('titlescreen');


document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('gameArea');
    const titlescreen = document.getElementById('titlescreen');

    if (titlescreen) {
        titlescreen.style.width = window.innerWidth * 0.9 + 'px';
        titlescreen.style.height = window.innerHeight * 0.9 + 'px';
    }
});

document.addEventListener('keydown', function (event) {
    var link = document.getElementById('link');
    link.click();
  });

