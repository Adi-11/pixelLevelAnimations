var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var image1 = new Image();
var particleArray = [];
var mouse = {
    x: null || 0,
    y: null || 0,
    radius: 100
};
window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //   console.log(mouse);
});
ctx.fillStyle = "white";
ctx.font = "30px Roboto";
ctx.fillText("Aditya", 0, 40);
ctx.strokeStyle = "white";
ctx.strokeRect(0, 0, 100, 100);
var textPixelData = ctx.getImageData(0, 0, 100, 100);
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.x = x + 100;
        this.y = y + 100;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 0.005 + 1;
    }
    Particle.prototype.draw = function () {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    Particle.prototype.update = function () {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var forceDirectionX = dx / distance;
        var forceDirectionY = dy / distance;
        var maxDistance = mouse.radius;
        var force = (maxDistance - distance) / maxDistance;
        var directionX = forceDirectionX * force * this.density;
        var directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
            //   this.size = 15;
            this.x += directionX;
            this.y -= directionY;
        }
        else {
            //   this.size = 3;
            if (this.x !== this.baseX) {
                var dx_1 = this.x - this.baseX;
                this.x -= dx_1 / 10;
            }
            if (this.x !== this.baseY) {
                var dy_1 = this.y - this.baseY;
                this.y -= dy_1 / 10;
            }
        }
    };
    return Particle;
}());
var init = function () {
    particleArray = [];
    for (var y = 0, y2 = textPixelData.height; y < y2; y++) {
        for (var x = 0, x2 = textPixelData.width; x < x2; x++) {
            if (textPixelData.data[y * 4 * textPixelData.width + x * 4 + 3] > 128) {
                var positionX = x;
                var positionY = y;
                particleArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }
};
init();
var connect = function () {
    for (var a = 0; a < particleArray.length; a++) {
        for (var b = a; b < particleArray.length; b++) {
            var dx = particleArray[a].x - particleArray[b].x;
            var dy = particleArray[a].y - particleArray[b].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 20) {
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
var animate = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
};
animate();
