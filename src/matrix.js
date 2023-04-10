import { distance, createDrops } from "./utils.js";
import { processCommand, darkTheme } from "./commands.js";

// This module is used to draw matrix characters drop
// and manipulate site theme

// First we will create canvas that will be full screen
/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var drops = createDrops();

function draw(drops) {
  // Draw black background
  ctx.fillStyle = darkTheme ? "#000" : "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw drops
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    styleDrops(drop);
    moveDropsOnTop(drop);
  }
}

function moveDropsOnTop(drop) {
  drop.y += drop.speed;
  if (drop.y > canvas.height) {
    drop.y = -16;
    drop.x = Math.floor(Math.random() * canvas.width);
  }
}

function styleDrops(drop) {
  ctx.fillStyle = drop.color;
  ctx.lineWidth = drop.speed;
  ctx.font = `${drop.fontSize}px monospace`;
  ctx.fillText(drop.text, drop.x, drop.y);
}

function loop() {
  draw(drops);
  requestAnimationFrame(loop);
}

var oldX = 0;
var oldY = 0;

function moveDropsAccordingToCursor(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    var d = distance(drop.x, drop.y, mouseX, mouseY);

    if (d <= 100) {
      if (mouseX < oldX && oldY === mouseY) {
        // West
        drop.x -= drop.speed * 3;
      } else if (mouseX > oldX && oldY === mouseY) {
        // East
        drop.x += drop.speed * 3;
      } else if (mouseX === oldX && mouseY < oldY) {
        // North
        drop.y -= drop.speed * 3;
      } else if (mouseX === oldX && mouseY > oldY) {
        // South
        drop.y += drop.speed * 3;
      }
    }
  }
  oldX = mouseX;
  oldY = mouseY;
}

addEventListener("mousemove", (event) => {
  moveDropsAccordingToCursor(event);
});

const toggleSwitch = document.getElementById("theme-toggle");

toggleSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    // Dark theme
    processCommand(`theme light`);
  } else {
    // Light theme
    processCommand(`theme dark`);
  }
});

export { loop };
