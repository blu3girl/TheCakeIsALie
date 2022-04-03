const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const lineWidthBtns = document.getElementById('lineWidthBtns');
const submitBtn = document.getElementById('submitBtn');
var widthBtns = [].slice.call(lineWidthBtns.querySelectorAll('.widthBtn'), 0);

const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'black';

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
let rect = canvas.getBoundingClientRect();

let isDrawing = false;
let lineWidth = 5;

let startX;
let startY;

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

const draw = (e) => {
  if(!isDrawing) {
    return;
  }
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
  isDrawing = false;
  ctx.stroke();
  ctx.beginPath();
})

canvas.addEventListener('mousemove', draw);

submitBtn.addEventListener('click', e => {
  var dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
  // var newTab = window.open('about:blank','image from canvas');
  // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
});