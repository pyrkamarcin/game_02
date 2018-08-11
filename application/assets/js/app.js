require('../../node_modules/bulma/bulma.sass')
require('../css/app.css');
require('../css/map.css');

var $ = require('jquery');

//
// Asset loader
//

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

//
// Game object
//

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

window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    Game.run(context);
};

var map = {
    cols: 8,
    rows: 8,
    tsize: 64,
    tiles: [
        [1, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [3, 1],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [3, 2],
        [1, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [3, 3]
    ],
    getTile: function (col, row) {
        return this.tiles[row * map.cols + col];
    }
};

Game.load = function () {
    return [
        Loader.loadImage('tiles', '../images/tiles.png'),
        Loader.loadImage('character', '../images/magnus.gif')
    ];
};

Game.init = function () {
    this.tileAtlas = Loader.getImage('tiles');
    this.character = Loader.getImage('character');
};

Game.update = function (delta) {
};

Game.render = function () {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(c, r);
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    (tile[0] - 1) * map.tsize, // source x
                    (tile[1] - 1) * map.tsize, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    c * map.tsize,  // target x
                    r * map.tsize, // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }

    listOfElements.forEach(
        function (value, index) {

            Game.ctx.drawImage(
                Game.character,
                0,
                0,
                map.tsize, // source width
                map.tsize, // source height
                value[0],  // target x
                value[1], // target y
                map.tsize, // target width
                map.tsize // target height
            )
        }
    );

    var width = map.cols * map.tsize;
    var height = map.rows * map.tsize;
    var x, y;
    for (var r = 0; r < map.rows; r++) {
        x = 0;
        y = r * map.tsize;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineWidth = "1";
        this.ctx.opacity = "0.95";
        this.ctx.strokeStyle = "gray";
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
    for (var c = 0; c < map.cols; c++) {
        x = c * map.tsize;
        y = 0;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }
};

var listOfElements = [];

var elem = document.getElementById('demo');

elem.addEventListener('click', function (e) {
    var X = Math.floor(e.offsetX / map.tsize + 1);
    var Y = Math.floor(e.offsetY / map.tsize + 1);

    console.log('sector: ' + X + '/' + Y);

    $.getJSON("ajax/test", {x: X, y: Y}, function (data) {
        $.each(data, function (key, val) {
            console.log('response: ' + key + '->' + val);

            listOfElements[0] = [(X - 1) * map.tsize, (Y - 1) * map.tsize, 64, 64];
        });
    });
}, false);