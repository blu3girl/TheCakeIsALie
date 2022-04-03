const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const lineWidthBtns = document.getElementById('lineWidthBtns');
const submitBtn = document.getElementById('submitBtn');
var widthBtns = [].slice.call(lineWidthBtns.querySelectorAll('.widthBtn'), 0);
let lineWidth = 5;
const ctx = canvas.getContext('2d');

lineWidthBtns.addEventListener('click', e => {
  let index = widthBtns.indexOf(e.target)
  if (index !== -1) {
    for (let i = 0; i < 3; i++) {
      widthBtns[i].classList.remove('active-btn');
    }
    e.target.classList.add('active-btn');

    if (index === 0) {
      lineWidth = 2;
    } else if (index === 1) {
      lineWidth = 5;
    } else if (index === 2) {
      lineWidth = 8;
    }
  }
});

// https://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
// Set up mouse events for drawing
var drawing = false;
var mousePos = { x: 0, y: 0 };
var lastPos = mousePos;

canvas.addEventListener("mousedown", function (e) {
  drawing = true;
  ctx.beginPath();
  lastPos = getMousePos(canvas, e);
}, false);
canvas.addEventListener("mouseup", function (e) {
  drawing = false;  
}, false);
canvas.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvas, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    ctx.lineWidth = lineWidth;
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}

// Allow for animation
(function drawLoop() {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  e.preventDefault();
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

submitBtn.addEventListener('click', e => {
  var dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
  // var newTab = window.open('about:blank','image from canvas');
  // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
});