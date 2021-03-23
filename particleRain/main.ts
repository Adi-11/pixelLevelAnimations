const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = 800;
canvas.height = 600;

const image1: HTMLImageElement = new Image();
// console.log(image1);
// image1.src =
//   "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80";
image1.src = "./EDGE_20_1_White.png";
image1.crossOrigin = "Anonymous";

image1.addEventListener("load", () => {
  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   console.log(pixels);
  const numberOfParticles = 5000;

  let mappedImage: any[] = [];
  const calculateRelativeBrightness = (
    red: number,
    green: number,
    blue: number
  ): number => {
    //   this formula adjust the red, green and blue by different amount for the human eye for relative brightness
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  };
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red: number = pixels.data[y * 4 * pixels.width + x * 4];
      const green: number = pixels.data[y * 4 * pixels.width + x * 4 + 1];
      const blue: number = pixels.data[y * 4 * pixels.width + x * 4 + 2];
      const brightness: number = calculateRelativeBrightness(red, green, blue);
      const cell = [brightness];
      row.push(cell);
    }
    mappedImage.push(row);
  }

  //   console.log(mappedImage);

  class Particles {
    x: number;
    y: number;
    speed: number;
    velocity: number;
    size: number;
    position1: number;
    position2: number;
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
    }

    update(): void {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = mappedImage[this.position1][this.position2][0];
      let movement = 2.5 - this.speed + this.velocity;
      this.y += movement;
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }

    draw(): void {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(this.x, this.y, this.size, 0, Math.PI);
      ctx.fill();
    }
  }
  let particleArray: Particles[] = [];
  const init = (): void => {
    for (let i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particles());
    }
  };

  init();

  const animate = (): void => {
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
      ctx.globalAlpha = particleArray[i].speed / 2;
      particleArray[i].draw();
    }
    requestAnimationFrame(animate);
  };

  animate();
});
