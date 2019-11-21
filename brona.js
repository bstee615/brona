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
let tiles = [];
for (let row = 0; row < 12; row ++) {
    tiles.push([]);
    for (let col = 0; col < 16; col ++) {
        tiles[row].push({
            loaded: false,
            name: "N/A",
            img: null,
            srcX: 0,
            srcY: 0,
            srcW: 0,
            srcH: 0
        });
    }
}

// Holds instances of the tiles
let sprites = [];

function loadTile(row, col) {
    let tile = tiles[row][col];
    if (tile.loaded) {
        return;
    }

    const tilewidth = 32;
    tile.name = name;
    tile.srcW = tilewidth;
    tile.srcH = tilewidth;
    tile.srcX = col * tilewidth;
    tile.srcY = row * tilewidth;

    tile.img = new Image();
    tile.img.onload = function() {
        tile.loaded = true;
    };
    tile.img.src = imagePath("forest_tiles.png");

    tiles[row][col] = tile;
}

function loadSprite(tilerow, tilecol, name = "Unnamed", x = 0, y = 0, w = 1, h = 1) {
    loadTile(tilerow, tilecol);

    sprites.push({
        tilerow,
        tilecol,
        name,
        x,
        y,
        w,
        h
    });
}

loadSprite(0, 13, "Mushroom");
loadSprite(0, 13, "Mushroom", 0, 1);
loadSprite(6, 0, "Pine_1", 2, 4);
loadSprite(7, 0, "Pine_2", 2, 5);
loadSprite(6, 1, "Pine_3", 3, 4);
loadSprite(7, 1, "Pine_4", 3, 5);

function renderLoopStep() {
    // Draw background image
    if (bgSpriteLoaded) {
        ctx.drawImage(bgSprite, 0, 0, canvas.width, canvas.height);
    }

    // Draw loaded tiles
    for (const sprite of sprites) {
        const tile = tiles[sprite.tilerow][sprite.tilecol];
        if (tile.loaded) {
            ctx.drawImage(tile.img, tile.srcX, tile.srcY, tile.srcW, tile.srcH, sprite.x * tilesize, sprite.y * tilesize, sprite.w * tilesize, sprite.h * tilesize);
        }
    }

    // Draw Brona
    if (bronaSpriteLoaded) {
        ctx.drawImage(bronaSprite, x, y, w * tilesize, h * tilesize);
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
