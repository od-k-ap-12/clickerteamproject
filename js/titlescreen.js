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

document.addEventListener('mousemove', function (e) {
    const dot = document.getElementById('customCursor');
    var rect = titlescreen.getBoundingClientRect();
    // размер окна * 0.9(= размер gameArea) / ширину или высоту 
    let scaleX = window.innerWidth * 0.9 / rect.width;
    let scaleY = window.innerHeight * 0.9 / rect.height;
    dot.style.left = (e.pageX - rect.left) * scaleX + 'px';
    dot.style.top = (e.pageY - rect.top) * scaleY + 'px';
    console.log(dot.style.left);
    console.log(dot.style.top);
});

