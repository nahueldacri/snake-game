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
var body = [];

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

// Create body and food
    player = new Rectangle(20,20,5,5);
    food = new Rectangle(80,80,5,5);

// Create walls
    wall.push(new Rectangle(0, 0, 300, 5));
    wall.push(new Rectangle(0, 0, 5, 150));
    wall.push(new Rectangle(295, 0, 5, 150));
    wall.push(new Rectangle(0, 145, 300, 5));
    wall.push(new Rectangle(45, 40, 5, 70));
    wall.push(new Rectangle(45, 110, 70, 5));
    wall.push(new Rectangle(170, 40, 70, 5));
    wall.push(new Rectangle(240, 40, 5, 70));
    wall.push(new Rectangle(140, 25, 5, 100));

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
    for (i = 0, l = body.length; i < l; i += 1) {
        body[i].fill(ctx);
        }

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
            ctx.fillStyle = '#9ff';
            ctx.fillText('GAME OVER', 150,75);
        }else{
            ctx.fillStyle = '#fff';
            ctx.fillText('PAUSE', 150, 75);
        }
        ctx.textAlign = 'left';
    }

// Draw score
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, (canvas.width - 60), 15);
}

function run() {
    setTimeout(run, 100);
    act();
}

function repaint() {
    window.requestAnimationFrame(repaint);  
    paint(ctx);
}
      
function act(){
    var i = 0;
    var l = 0;
    if(!pause) {
// GameOver Reset
        if (gameover) {
            reset();
        }

// Move Body
        for (i = body.length - 1; i > 0; i -= 1) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
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
            body[0].y -= 5;
            }
        if (dir == 1) {
            body[0].x += 5;
            }
        if (dir == 2) {
            body[0].y += 5;
            }
        if (dir == 3) {
            body[0].x -= 5;
            }  

// Out Screen    
        if (body[0].x > canvas.width) {
            body[0].x = 0;
            }
        if (body[0].y > canvas.height) {
            body[0].y = 0;
            }
        if (body[0].x < 0) {
            body[0].x = canvas.width;
            }
        if (body[0].y < 0) {
            body[0].y = canvas.height;
            } 

// Body Intersects
        for (i = 2, l = body.length; i < l; i += 1) {
            if (body[0].intersects(body[i])) {
                gameover = true;
                pause = true;
            }
        }
// Food Intersects
        if (body[0].intersects(food)) {
            body.push(new Rectangle(food.x, food.y, 5, 5));
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
            if (body[0].intersects(wall[i])) {
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
    body.length = 0;
    body.push(new Rectangle(20, 20, 5, 5));
    body.push(new Rectangle(0, 0, 5, 5));
    body.push(new Rectangle(0, 0, 5, 5));
    food.x = random(canvas.width / 5 - 1) * 5;
    food.y = random(canvas.height / 5 - 1) * 5;
    gameover = false;
}
    