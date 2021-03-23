const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = 800;
canvas.height = 600;

const image1: HTMLImageElement = new Image();
// console.log(image1);
image1.src =
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80";
image1.crossOrigin = "Anonymous";

image1.addEventListener("load", () => {
  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const scannedImage: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  //   console.log(scannedImage);
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const rgbaTotal = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];

    const rgbaAverage = rgbaTotal / 3;
    scannedData[i] = rgbaAverage;
    scannedData[i + 1] = rgbaAverage;
    scannedData[i + 2] = rgbaAverage;
  }
  //   to be handled later no need to worry this error while not cause any rendering problem
  scannedImage.data = scannedData;
  //
  ctx.putImageData(scannedImage, 0, 0);
});
