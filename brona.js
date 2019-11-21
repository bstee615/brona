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

let targetPosition = {
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
    const delta = {
        x: 0,
        y: 0
    };
    if (targetPosition.x != null) {
        delta.x = targetPosition.x - x;
    }
    if (targetPosition.y != null) {
        delta.y = targetPosition.y - y;
    }

    const magnitude = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
    if (magnitude > 0) {
        const deltaUnit = {
            x: delta.x / magnitude,
            y: delta.y / magnitude
        };
        let netDelta = {
            x: deltaUnit.x * speed,
            y: deltaUnit.y * speed
        };

        if (Math.sqrt(delta.x*delta.x + delta.y*delta.y) <= speed) {
            // Within small distance of target -
            // correct to exact and reset targetPosition.
            netDelta = delta;
            targetPosition.x = null;
            targetPosition.y = null;
        }
    
        x += netDelta.x;
        y += netDelta.y;
    }
}

function gameLoop() {
    movementLoopStep();
    renderLoopStep();

    // Loop forever
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
