const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const image1: HTMLImageElement = new Image();

let particleArray: Particle[] = [];
const mouse = {
  x: null || 0,
  y: null || 0,
  radius: 150,
};

window.addEventListener("mousemove", (event: MouseEvent) => {
  mouse.x = event.x;
  mouse.y = event.y;

  //   console.log(mouse);
});

ctx.fillStyle = "white";
ctx.font = "40px Roboto";
ctx.fillText("Aditya", 0, 40);
ctx.strokeStyle = "white";
ctx.strokeRect(0, 0, 200, 200);
const textPixelData = ctx.getImageData(0, 0, 200, 200);

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  constructor(x: number, y: number) {
    this.x = x + 100;
    this.y = y + 100;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 0.05 + 1;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      //   this.size = 15;
      this.x -= directionX;
      this.y += directionY;
    } else {
      //   this.size = 3;
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.x !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

const init = (): void => {
  particleArray = [];

  for (let y = 0, y2 = textPixelData.height; y < y2; y++) {
    for (let x = 0, x2 = textPixelData.width; x < x2; x++) {
      if (textPixelData.data[y * 4 * textPixelData.width + x * 4 + 3] > 128) {
        let positionX = x;
        let positionY = y;
        particleArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
};

init();
const connect = (): void => {
  let opacity = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // opacity = 1 - distance / 30;
      // ctx.strokeStyle = "rgba(255, 255, 255," + opacity + ")";
      if (distance < 30) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
};

// console.log(particleArray);
const animate = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
};

animate();
