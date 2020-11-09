// First pattern created

var canvas = null,
ctx = null;

var x = 150,
y = 75;

var lastPress = null;

var KEY_LEFT = 37,
KEY_UP = 38,
KEY_RIGHT = 39,
KEY_DOWN = 40,
KEY_ENTER = 13;

var dir = 0;

var pause = true;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || 
       window.mozRequestAnimationFrame || 
       window.webkitRequestAnimationFrame || 
       function (callback) { 
           window.setTimeout(callback, 17); 
}; }());

// Start the game

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    run();
    repaint();
}

// Painting the snake

function paint(ctx) {   
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 10, 10);
    
// Draw pause

    if (pause) {
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', 150, 75);
        ctx.textAlign = 'left';
    }
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
    if(!pause) {

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
            y -= 10;
            }
        if (dir == 1) {
            x += 10;
            }
        if (dir == 2) {
            y += 10;
            }
        if (dir == 3) {
            x -= 10;
            }  

// Out Screen
        
        if (x > canvas.width) {
            x = 0;
            }
        if (y > canvas.height) {
            y = 0;
            }
        if (x < 0) {
            x = canvas.width;
            }
        if (y < 0) {
            y = canvas.height;
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
    

