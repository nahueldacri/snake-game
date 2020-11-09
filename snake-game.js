// Variables

var canvas = null,
ctx = null,
player = null,
lastPress = null, 
food = null;

var KEY_LEFT = 37,
KEY_UP = 38,
KEY_RIGHT = 39,
KEY_DOWN = 40,
KEY_ENTER = 13;

var dir = 0,
score = 0;

var pause = true,
gameover = true;

var wall = [];

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || 
       window.mozRequestAnimationFrame || 
       window.webkitRequestAnimationFrame || 
       function (callback) { 
           window.setTimeout(callback, 17); 
}; }());

// Init the game
function init() {

// Get canvas and context
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

// Create player and food
    player = new Rectangle(40,40,5,5);
    food = new Rectangle(80,80,5,5);

// Create walls
    wall.push(new Rectangle(100, 50, 10, 10));
    wall.push(new Rectangle(100, 100, 10, 10));
    wall.push(new Rectangle(200, 50, 10, 10));
    wall.push(new Rectangle(200, 100, 10, 10));

// Start the game
    run();
    repaint();
}

// Painting the snake
function paint(ctx) {   
    var i = 0,
        l = 0;

// Clean canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

// Draw player
    ctx.fillStyle = '#fff';
    player.fill(ctx);

// Draw food 
    ctx.fillStyle = '#ff0';
    food.fill(ctx);

// Draw walls
    ctx.fillStyle = '#f00';
    for (i = 0, l = wall.length; i < l; i += 1) {
    wall[i].fill(ctx);
    }

// Debug last key pressed
    ctx.fillStyle = '#fff';

// Draw pause
    if (pause) {
        ctx.textAlign = 'center';
        if (gameover) {
            ctx.fillStyle = '#f00';
            ctx.fillText('GAME OVER', 150,75);
        }else{
            ctx.fillStyle = '#fff';
            ctx.fillText('PAUSE', 150, 75);
        }
        ctx.textAlign = 'left';
    }

// Draw score
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, (canvas.width - 50), 10);
}

function run() {
    setTimeout(run, 200);
    act();
}

function repaint() {
    window.requestAnimationFrame(repaint);  
    paint(ctx);
}
      
function act(){
    var i,
        l;
    if(!pause) {
// GameOver Reset
        if (gameover) {
            reset();
        }
    
// Detect direction
        if (lastPress == KEY_UP) {
            dir = 0;
            }
        if (lastPress == KEY_RIGHT) {
            dir = 1;
        }
        if (lastPress == KEY_DOWN) {
            dir = 2;
        }
        if (lastPress == KEY_LEFT) {
            dir = 3;
        } 

// Move rect
        if (dir == 0) {
            player.y -= 5;
            }
        if (dir == 1) {
            player.x += 5;
            }
        if (dir == 2) {
            player.y += 5;
            }
        if (dir == 3) {
            player.x -= 5;
            }  

// Out Screen    
        if (player.x > canvas.width) {
            player.x = 0;
            }
        if (player.y > canvas.height) {
            player.y = 0;
            }
        if (player.x < 0) {
            player.x = canvas.width;
            }
        if (player.y < 0) {
            player.y = canvas.height;
            } 
// Food Intersects
        if (player.intersects(food)) {
            score += 10;
            food.x = random(canvas.width / 5 - 1) * 5;
            food.y = random(canvas.height / 5 - 1) * 5;
        }

// Wall Intersects
        for (i = 0, l = wall.length; i < l; i += 1) {
            if (food.intersects(wall[i])) {
                food.x = random(canvas.width / 5 - 1) * 5;
                food.y = random(canvas.height / 5 - 1) * 5;
            }
            if (player.intersects(wall[i])) {
                gameover = true;
                pause = true;
            }
        }    
    }
// Pause/Unpause
    if (lastPress == KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    } 
}

window.addEventListener('load', init, false);

document.addEventListener('keydown', function (evt) {
    lastPress = evt.which;
    }, false);
    
function Rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    
    this.intersects = function (rect) {
        if (rect == null) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    };
    
    this.fill = function (ctx) {
        if (ctx == null) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

// Random number for the food
function random(max) {
    return Math.floor(Math.random() * max);
}

// Reset the game 
function reset() {
    score = 0;
    dir = 1;
    player.x = 40;
    player.y = 40;
    food.x = random(canvas.width / 5 - 1) * 5;
    food.y = random(canvas.height / 5 - 1) * 5;
    gameover = false;
}
    