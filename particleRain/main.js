var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
var image1 = new Image();
// console.log(image1);
// image1.src =
//   "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80";
// image1.src = "./img.jpg";
image1.src = "./EDGE_20_1_White.png";
image1.crossOrigin = "Anonymous";
image1.addEventListener("load", function () {
  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   console.log(pixels);
  var numberOfParticles = 5000;
  var mappedImage = [];
  var calculateRelativeBrightness = function (red, green, blue) {
    //   this formula adjust the red, green and blue by different amount for the human eye for relative brightness
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  };
  for (var y = 0; y < canvas.height; y++) {
    var row = [];
    for (var x = 0; x < canvas.width; x++) {
      var red = pixels.data[y * 4 * pixels.width + x * 4];
      var green = pixels.data[y * 4 * pixels.width + x * 4 + 1];
      var blue = pixels.data[y * 4 * pixels.width + x * 4 + 2];
      var brightness = calculateRelativeBrightness(red, green, blue);
      var cell = [brightness, "rgb(" + red + "," + green + "," + blue + ")"];
      row.push(cell);
    }
    mappedImage.push(row);
  }
  console.log(mappedImage);
  var Particles = /** @class */ (function () {
    function Particles() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.angle = 0;
    }
    Particles.prototype.update = function () {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.speed = mappedImage[this.position1][this.position2][0];
      var movement = 2.5 - this.speed + this.velocity;
      this.angle += 1;
      // effect 1
      // this.y += movement;
      // if (this.y >= canvas.height) {
      //   this.y = 0;
      //   this.x = Math.random() * canvas.width;
      // }
      // effect 2
      this.y += movement;
      this.x += movement;
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    };
    Particles.prototype.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = mappedImage[this.position1][this.position2][1];
      ctx.arc(this.x, this.y, this.size, 0, Math.PI);
      ctx.fill();
    };
    return Particles;
  })();
  var particleArray = [];
  var init = function () {
    for (var i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particles());
    }
  };
  init();
  var animate = function () {
    // ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (var i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
      ctx.globalAlpha = particleArray[i].speed / 2;
      particleArray[i].draw();
    }
    requestAnimationFrame(animate);
  };
  animate();
});
