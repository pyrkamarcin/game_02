require('../../node_modules/bulma/bulma.sass')
require('../css/app.css');
require('../css/map.css');

var $ = require('jquery');

var Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

var Game = {};

Game.run = function (context) {
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, 512, 512);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);

// override these methods to create the demo
Game.init = function () {
};
Game.update = function (delta) {
};
Game.render = function () {
};

window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    Game.run(context);
};

var map = {
    cols: 12,
    rows: 12,
    tsize: 64,
    layers: [[
        [1, 1], [2, 1], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3],
        [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3], [1, 3]
    ], [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    }
};

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}

Camera.SPEED = 128; // pixels per second

Camera.prototype.move = function (delta, dirx, diry) {
    // move camera
    this.x += dirx * Camera.SPEED * delta;
    this.y += diry * Camera.SPEED * delta;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
};

Game.load = function () {
    return [
        Loader.loadImage('tiles', '../images/tiles.png'),
    ];
};

Game.init = function () {
    this.tileAtlas = Loader.getImage('tiles');
    this.camera = new Camera(map, 512, 512);

    // create a canvas for each layer
    this.layerCanvas = map.layers.map(function () {
        var c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        return c;
    });

    // initial draw of the map
    this._drawMap();
};

Game.update = function (delta) {
    this.hasScrolled = false;
    // handle camera movement with arrow keys
    var dirx = 0;
    var diry = 0;
    // if (Keyboard.isDown(Keyboard.LEFT)) {
    //     dirx = -1;
    // }
    // if (Keyboard.isDown(Keyboard.RIGHT)) {
    //     dirx = 1;
    // }
    // if (Keyboard.isDown(Keyboard.UP)) {
    //     diry = -1;
    // }
    // if (Keyboard.isDown(Keyboard.DOWN)) {
    //     diry = 1;
    // }

    if (dirx !== 0 || diry !== 0) {
        this.camera.move(delta, dirx, diry);
        this.hasScrolled = true;
    }
};

Game._drawMap = function () {
    map.layers.forEach(function (layer, index) {
        this._drawLayer(index);
    }.bind(this));
};

Game._drawLayer = function (layer) {
    var context = this.layerCanvas[layer].getContext('2d');

    context.clearRect(0, 0, 512, 512);

    var startCol = Math.floor(this.camera.x / map.tsize);
    var endCol = startCol + (this.camera.width / map.tsize);
    var startRow = Math.floor(this.camera.y / map.tsize);
    var endRow = startRow + (this.camera.height / map.tsize);
    var offsetX = -this.camera.x + startCol * map.tsize;
    var offsetY = -this.camera.y + startRow * map.tsize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, c, r);
            var x = (c - startCol) * map.tsize + offsetX;
            var y = (r - startRow) * map.tsize + offsetY;
            if (tile !== 0) { // 0 => empty tile
                context.drawImage(
                    this.tileAtlas, // image
                    (tile[0] - 1) * map.tsize, // source x
                    (tile[1] - 1) * map.tsize, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
};

Game._drawGrid = function () {
    var width = map.cols * map.tsize;
    var height = map.rows * map.tsize;
    var x, y;
    for (var r = 0; r < map.rows; r++) {
        x = -this.camera.x;
        y = r * map.tsize - this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineWidth = "1";
        this.ctx.opacity = "0.95";
        this.ctx.strokeStyle = "gray";
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < map.cols; c++) {
        x = c * map.tsize - this.camera.x;
        y = -this.camera.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }
};

Game.render = function () {
    // re-draw map if there has been scroll
    if (this.hasScrolled) {
        this._drawMap();
    }

    // draw the map layers into game context
    this.ctx.drawImage(this.layerCanvas[0], 0, 0);
    this.ctx.drawImage(this.layerCanvas[1], 0, 0);
    this._drawGrid();
};

var elem = document.getElementById('demo');

elem.addEventListener('click', function (e) {
    var X = Math.floor((e.offsetX + Game.camera.x) / map.tsize + 1);
    var Y = Math.floor((e.offsetY + Game.camera.y) / map.tsize + 1);

    console.log('sector: ' + X + '/' + Y);

    $.getJSON("ajax/test", {x: X, y: Y}, function (data) {
        $.each(data, function (key, val) {
            console.log('response: ' + key + '->' + val);
            // Game.ctx.rect(64, 64, 64, 64);
            // Game.ctx.rect((X - 1) * map.tsize, (Y - 1) * map.tsize, 64, 64)

        });
    });
}, false);