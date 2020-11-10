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

var iBody = new Image();
var iFood = new Image();

var aEat = new Audio();
var aDie = new Audio();


window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || 
       window.mozRequestAnimationFrame || 
       window.webkitRequestAnimationFrame || 
       function (callback) { 
           window.setTimeout(callback, 17); 
}; }());

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
    body.push(new Rectangle(30, 30, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
}

// Painting the snake
function paint(ctx) {   
    var i = 0,
        l = 0;

// Clean canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

// Draw player
    //ctx.fillStyle = '#fff';
    for (i = 0, l = body.length; i < l; i += 1) {
        //body[i].fill(ctx);
        ctx.drawImage(iBody, body[i].x, body[i].y);
    }

// Draw food 
    //ctx.fillStyle = '#ff0';
    //food.fill(ctx);
    ctx.drawImage(iFood, food.x, food.y);

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
            ctx.fillText('GAME OVER', 300,150);
        }else{
            ctx.fillStyle = '#fff';
            ctx.fillText('PAUSE', 300, 150);
        }
        ctx.textAlign = 'left';
    }

// Draw score
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, (canvas.width - 60), 15);
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
        if (lastPress == KEY_UP && dir != 2) {
            dir = 0;
            }
        if (lastPress == KEY_RIGHT && dir != 3) {
            dir = 1;
        }
        if (lastPress == KEY_DOWN && dir != 0) {
            dir = 2;
        }
        if (lastPress == KEY_LEFT && dir != 1) {
            dir = 3;
        } 

// Move rect
        if (dir == 0) {
            body[0].y -= 10;
            }
        if (dir == 1) {
            body[0].x += 10;
            }
        if (dir == 2) {
            body[0].y += 10;
            }
        if (dir == 3) {
            body[0].x -= 10;
            }  

// Out Screen    
/*        if (body[0].x > canvas.width) {
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
*/
// Body Intersects
        for (i = 2, l = body.length; i < l; i += 1) {
            if (body[0].intersects(body[i])) {
                gameover = true;
                pause = true;
                aDie.play();
            }
        }
// Food Intersects
        if (body[0].intersects(food)) {
            body.push(new Rectangle(food.x, food.y, 10, 10));
            score += 10;
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
            aEat.play();
        }
    
// Wall Intersects
        for (i = 0, l = wall.length; i < l; i += 1) {
            if (food.intersects(wall[i])) {
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
            if (body[0].intersects(wall[i])) {
                gameover = true;
                pause = true;
                aDie.play();
            }
        }    
    }

// Pause/Unpause
    if (lastPress == KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    } 
}

function repaint() {
    window.requestAnimationFrame(repaint);  
    paint(ctx);
}

function run() {
    setTimeout(run, 100);
    act();
}

// Init the game
function init() {

// Get canvas and context
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

// Load assets
    iBody.src = 'assets/body.png';
    iFood.src = 'assets/fruit.png';
    aEat.src = 'assets/eat-snake.mp3';
    aDie.src = 'assets/die-snake.mp3';

// Create body and food
    player = new Rectangle(20,20,10,10);
    food = new Rectangle(80,80,10,10);

// Create walls
    wall.push(new Rectangle(0, 0, 600, 5));
    wall.push(new Rectangle(0, 0, 5, 300));
    wall.push(new Rectangle(595, 0, 5, 300));
    wall.push(new Rectangle(0, 295, 600, 5));
    wall.push(new Rectangle(295, 70, 10, 150));
    wall.push(new Rectangle(100, 70, 400, 10));
    wall.push(new Rectangle(100, 220, 400, 10));

// Start the game
    repaint();
    run();
}
    

window.addEventListener('load', init, false);
    

    