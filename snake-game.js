// First pattern created

var canvas = null,
ctx = null;

function paint(ctx) {
ctx.strokeStyle = 'black';
ctx.strokeRect(110, 144, 5, 5);
}

function init() {
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
paint(ctx);
}

window.addEventListener('load', init, false);
