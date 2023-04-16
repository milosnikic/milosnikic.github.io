import { distance, createDrops, Drop } from "./utils.js";
import { Terminal } from "./terminal.js";
import { InputProcessor } from "./input.js";

export class UserInterface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  drops: Drop[];
  oldX: number;
  oldY: number;
  toggleSwitch: HTMLElement;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas!.getContext("2d") as CanvasRenderingContext2D;
    this.drops = createDrops(this.canvas);
    this.oldX = 0;
    this.oldY = 0;
    this.toggleSwitch = document.getElementById("theme-toggle") as HTMLElement;
    addEventListener("mousemove", (event) => {
      this.moveDropsAccordingToCursor(event);
    });
    this.toggleSwitch.addEventListener("change", (event) => {
      this.setTheme(event);
    });
    this.typewrite("milOS CLI: Streamline Your Skills");
    new InputProcessor();
  }

  draw() {
    this.ctx.fillStyle = Terminal.isDarkTheme() ? "#000" : "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.drops.length; i++) {
      const drop = this.drops[i];
      this.styleDrops(drop);
      this.moveDrops(drop);
    }
  }

  private moveDrops(drop: Drop) {
    drop.y += drop.speed;
    if (drop.y > this.canvas.height) {
      drop.y = -16;
      drop.x = Math.floor(Math.random() * this.canvas.width);
    }
  }

  private styleDrops(drop: Drop) {
    this.ctx.fillStyle = drop.color;
    this.ctx.lineWidth = drop.speed;
    this.ctx.font = `${drop.fontSize}px monospace`;
    this.ctx.fillText(drop.text, drop.x, drop.y);
  }

  moveDropsAccordingToCursor(event: MouseEvent) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    for (let i = 0; i < this.drops.length; i++) {
      const drop: Drop = this.drops[i];
      var d = distance(drop.x, drop.y, mouseX, mouseY);

      if (d <= 100) {
        if (mouseX < this.oldX && this.oldY === mouseY) {
          // West
          drop.x -= drop.speed * 3;
        } else if (mouseX > this.oldX && this.oldY === mouseY) {
          // East
          drop.x += drop.speed * 3;
        } else if (mouseX === this.oldX && mouseY < this.oldY) {
          // North
          drop.y -= drop.speed * 3;
        } else if (mouseX === this.oldX && mouseY > this.oldY) {
          // South
          drop.y += drop.speed * 3;
        }
      }
    }
    this.oldX = mouseX;
    this.oldY = mouseY;
  }

  private setTheme(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      Terminal.setTheme(false);
    } else {
      Terminal.setTheme(true);
    }
  }

  typewrite(text: string, i: number = 0) {
    const container = document.getElementById("typewriter-text");
    container!.textContent = text.substring(0, i);
    if (i < text.length) {
      setTimeout(
        () => this.typewrite(text, i + 1),
        Math.floor(Math.random() * (80 - 60) + 60)
      );
    } else {
      setTimeout(() => this.typewrite(text, 0), 15000);
    }
  }
}
