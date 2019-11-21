const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function imagePath(filepath) {
    return `images/${filepath}`;
}

const tilesize = canvas.width / 24;

let bronaSprite = new Image();
let bronaSpriteLoaded = false;
let x = 50, y = 50;
let w = 1, h = 1;
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

// Update stuff
canvas.addEventListener("click", function(ev) {
    targetPosition = {
        x: ev.offsetX - w*tilesize/2,
        y: ev.offsetY - h*tilesize/2
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

// Tile stuff
// 12x16 tiles
let tileInfo = [];
for (let row = 0; row < 12; row ++) {
    tileInfo.push([]);
    for (let col = 0; col < 16; col ++) {
        tileInfo[row].push({
            loaded: false,
            name: "N/A",
            img: null,
            srcX: 0,
            srcY: 0,
            x: 0,
            y: 0,
            w: 0,
            h: 0
        });
    }
}

function loadTile(row, col, name = "Unnamed", x = 0, y = 0, w = 1, h = 1) {
    let tile = tileInfo[row][col];
    if (tile.loaded) {
        return;
    }

    const tilewidth = 32;

    tile.img = new Image();
    tile.img.onload = function() {
        tile.loaded = true;
        tile.name = name;
        tile.x = x;
        tile.y = y;
        tile.w = w;
        tile.h = h;
        tile.srcW = tilewidth;
        tile.srcH = tilewidth;
        tile.srcX = col * tilewidth;
        tile.srcY = row * tilewidth;
    };
    tile.img.src = imagePath("forest_tiles.png");

    tileInfo[row][col] = tile;
}

loadTile(0, 13, "Mushroom");
loadTile(6, 0, "Pine_1", 2, 4);
loadTile(7, 0, "Pine_2", 2, 5);
loadTile(6, 1, "Pine_3", 3, 4);
loadTile(7, 1, "Pine_4", 3, 5);

function renderLoopStep() {
    // Draw background image
    if (bgSpriteLoaded) {
        ctx.drawImage(bgSprite, 0, 0, canvas.width, canvas.height);
    }

    // Draw Brona
    if (bronaSpriteLoaded) {
        ctx.drawImage(bronaSprite, x, y, w * tilesize, h * tilesize);
    }

    // Draw loaded tiles
    for (const row of tileInfo) {
        for (const tile of row) {
            if (tile.loaded) {
                ctx.drawImage(tile.img, tile.srcX, tile.srcY, tile.srcW, tile.srcH, tile.x * tilesize, tile.y * tilesize, tile.w * tilesize, tile.h * tilesize);
            }
        }
    }
}

let targetPosition = {
    x: null,
    y: null
};

function gameLoop() {
    movementLoopStep();
    renderLoopStep();

    // Loop forever
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
