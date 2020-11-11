/*jslint bitwise:true, es5: true */
(function (window, undefined){

// Variables

var canvas = null,
ctx = null,
player = null,
lastPress = null, 
food = null,
specialFruit = null;

var KEY_LEFT = 37,
KEY_UP = 38,
KEY_RIGHT = 39,
KEY_DOWN = 40,
KEY_ENTER = 13;

var dir = 0,
score = 0;

var pause = true,
gameover = true,
congratulations = true,
bonusFruit = false;

var wall = [];
var body = [];

var iBody = new Image();
var iFood = new Image();
var iSpecialFruit = new Image();

var aEat = new Audio();
var aDie = new Audio();

/*var lastUpdate = 0,
    FPS = 0,
    frames = 0,
    acumDelta = 0;*/

var currentScene = 0,
    scenes = [];

var mainScene = null,
    gameScene = null;    

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || 
       window.mozRequestAnimationFrame || 
       window.webkitRequestAnimationFrame || 
       function (callback) { 
           window.setTimeout(callback, 17); 
}; }());

document.addEventListener('keydown', function (evt) {
    if (evt.which >= 37 && evt.which <= 40) {
    evt.preventDefault();
    }
    lastPress = evt.which;
}, false);

function Rectangle(x, y, width, height) {
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.width = (width === undefined) ? 0 : width;
    this.height = (height === undefined) ? this.width : height;
}

Rectangle.prototype = {
    constructor: Rectangle,
    
    intersects : function (rect) {
        if (rect === undefined) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    },

    fill : function (ctx) {
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },

    drawImage : function (ctx, img) {
        if (img === undefined) {
            window.console.warn('Missing parameters on function drawImage');
        } else {
            if (img.width) {
                ctx.drawImage(img, this.x, this.y);
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    } 
};   

// Scenes
function Scene() {
    this.id = scenes.length;
    scenes.push(this);
}
Scene.prototype = {
    constructor: Scene,

    load: function(){},
    paint: function(ctx){},
    act: function(){}
};

// Function load scene
function loadScene (scene) {
    currentScene = scene.id;
    scenes[currentScene].load();
}

// Random number for the food
function random(max) {
    return ~~(Math.random() * max);
}

function repaint() {
    window.requestAnimationFrame(repaint);  
    if (scenes.length) {
        scenes[currentScene].paint(ctx);
    } 
}

function run() {
    setTimeout(run, 100);
    if (scenes.length) {
        scenes[currentScene].act();
    }
}

// Init the game
function init() {

// Get canvas and context
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

// Load assets
    iBody.src = 'assets/body.png';
    iFood.src = 'assets/fruit.png';
    iSpecialFruit.src = 'assets/special-fruit.png';
    aEat.src = 'assets/eat-snake.mp3';
    aDie.src = 'assets/die-snake.mp3';

// Load buffer
    /*buffer = document.createElement('canvas');
    bufferCtx = buffer.getContext ('2d');
    buffer.width = 600;
    buffer.heigth = 300;*/

// Create body and food
    player = new Rectangle(20,20,10,10);
    food = new Rectangle(80,80,10,10);
    specialFruit = new Rectangle(100,100,20,20);

// Create walls
    wall.push(new Rectangle(0, 0, 600, 5));
    wall.push(new Rectangle(0, 0, 5, 300));
    wall.push(new Rectangle(595, 0, 5, 300));
    wall.push(new Rectangle(0, 295, 600, 5));
    wall.push(new Rectangle(295, 70, 10, 150));
    wall.push(new Rectangle(100, 70, 400, 10));
    wall.push(new Rectangle(100, 220, 400, 10));

// Start the game
    run();
    repaint();
}

// Main Scene
mainScene = new Scene();

mainScene.paint = function (ctx) {

// Clean canvas
    ctx.fillStyle = '#030';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw title
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE', 300, 120);
    ctx.fillText('Press Enter', 300, 150);
};
    mainScene.act = function () {

// Load next scene
    if (lastPress === KEY_ENTER) {
        loadScene(gameScene);
        lastPress = null;
    }
};

// Game scene
gameScene = new Scene();

// Reset the game 
gameScene.load= function () {
    score = 0;
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(30, 30, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
    congratulations = false;
};

// Painting the snake
gameScene.paint = function (ctx) {   
    var i = 0,
        l = 0;

// Clean canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

// Draw player
    //ctx.fillStyle = '#fff';
    for (i = 0, l = body.length; i < l; i += 1) {
        //body[i].fill(ctx);
        body[i].drawImage(ctx, iBody);
    }

// Draw food 
    //ctx.fillStyle = '#ff0';
    //food.fill(ctx);
    //ctx.drawImage(iFood, food.x, food.y);
    food.drawImage(ctx, iFood);

// Draw special fruit
    if (bonusFruit = true) {
        specialFruit.drawImage(ctx, iSpecialFruit);
    } 

// Draw walls
    ctx.fillStyle = '#f00';
    for (i = 0, l = wall.length; i < l; i += 1) {
    wall[i].fill(ctx);
    }

// Debug last key pressed
    //ctx.fillStyle = '#fff';

// Draw pause
    if (pause) {
        ctx.textAlign = 'center';
        if (gameover) {
            ctx.fillStyle = '#9ff';
            ctx.fillText('GAME OVER', 300,150);
        }if (congratulations){
            ctx.fillStyle = '#0f0';
            ctx.fillText('CONGRATULATIONS', 300, 150);
        }else{
            ctx.fillStyle = '#fff';
            ctx.fillText('PAUSE', 300, 150);
        }
        ctx.textAlign = 'left';
    }
    
// Draw score
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, (canvas.width - 60), 15);

// Frames per seconds
    //ctx.fillText('FPS: ' + FPS, 10, 15);
};

gameScene.act = function () {
    var i = 0;
    var l = 0;
    if(!pause) {
        
// GameOver Reset
        if (gameover || congratulations) {
            loadScene(mainScene);
        }

// Move Body
        for (i = body.length - 1; i > 0; i -= 1) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
            }
        
// Detect direction
        if (lastPress === KEY_UP && dir !== 2) {
            dir = 0;
            }
        if (lastPress === KEY_RIGHT && dir !== 3) {
            dir = 1;
        }
        if (lastPress === KEY_DOWN && dir !== 0) {
            dir = 2;
        }
        if (lastPress === KEY_LEFT && dir !== 1) {
            dir = 3;
        } 

// Move rect
        if (dir === 0) {
            body[0].y -= 10;
            }
        if (dir === 1) {
            body[0].x += 10;
            }
        if (dir === 2) {
            body[0].y += 10;
            }
        if (dir === 3) {
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

// Special fruit Intersects
        if (body[0].intersects(specialFruit) && bonusFruit === true) {
            score += 50;
            specialFruit.x = random(canvas.width / 20 - 1) * 20;
            specialFruit.y = random(canvas.height / 20 - 1) * 20;
            aEat.play();
            bonusFruit = false;

// Asynchronous call
            fetch ("https://jsonplaceholder.typicode.com/?score="+score)
            .then (function (response){
                console.log("Score sent succssfully");
            })
            .catch (function (error){
                console.log("Error trying to send the score")
            })
        }  
    
// Wall Intersects
        for (i = 0, l = wall.length; i < l; i += 1) {
            if (food.intersects(wall[i])) {
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
            if (specialFruit.intersects(wall[i])) {
                specialFruit.x = random(canvas.width / 10 - 1) * 10;
                specialFruit.y = random(canvas.height / 10 - 1) * 10;
            }
            if (body[0].intersects(wall[i])) {
                gameover = true;
                pause = true;
                aDie.play();
            }
        } 
        setTimeout (bonus, 10000);
            function bonus () {
                bonusFruit = true;
            }
// Congratulations
        if (score >= 500){
            pause = true;
            congratulations = true;
        }
    }

// Pause/Unpause
    if (lastPress === KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    } 
}

// Resize
function resize () {
    var w = window.innerWidth / canvas.width;
    var h = window.innerHeight / canvas.height;
    var scale = Math.min(h, w);

    canvas.style.width = (canvas.width * scale) + 'px';
    canvas.style.height = (canvas.height * scale) + 'px';
}
    
window.addEventListener('load', init, false);
window.addEventListener('resize', resize, false);

}(window));

    