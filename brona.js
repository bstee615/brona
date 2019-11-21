const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function imagePath(filepath) {
    return `images/${filepath}`;
}

let bronaSprite = new Image();
let bronaSpriteLoaded = false;
let x = 50, y = 50;
let w = 75, h = 75;
bronaSprite.onload = function() {
  bronaSpriteLoaded = true;
};
bronaSprite.src = imagePath("brona.png");

let bgSprite = new Image();
let bgSpriteLoaded = false;
bgSprite.onload = function() {
    bgSpriteLoaded = true;
};
bgSprite.src = imagePath("forest.png");

function renderLoopStep() {
    // Draw background image
    if (bgSpriteLoaded) {
        ctx.drawImage(bgSprite, 0, 0, canvas.width, canvas.height);
    }

    // Draw Brona
    if (bronaSpriteLoaded) {
        ctx.drawImage(bronaSprite, x, y, w, h);
    }
}

var targetPosition = {
    x: null,
    y: null
};

canvas.addEventListener("click", function(ev) {
    targetPosition = {
        x: ev.clientX,
        y: ev.clientY
    };
});

function movementLoopStep() {
    const speed = 10;
    if (targetPosition.x != null) {
        let xSpeed = speed * Math.sign(targetPosition.x - x);
        if (Math.abs(targetPosition.x - x) < speed) {
            xSpeed = targetPosition.x - x;
            targetPosition.x = null;
        }
        x += xSpeed;
    }
    if (targetPosition.y != null) {
        let ySpeed = speed * Math.sign(targetPosition.y - y);
        if (Math.abs(targetPosition.y - y) < speed) {
            ySpeed = targetPosition.y - y;
            targetPosition.y = null;
        }
        y += ySpeed;
    }
}

function gameLoop() {
    movementLoopStep();
    renderLoopStep();

    // Loop forever
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
