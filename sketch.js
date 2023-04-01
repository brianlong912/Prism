let boundaries = [];
let rays = [];
let prism;

function setup() {
  createCanvas(700, 500);
  background(0);

  let raypos = createVector(0, 250);
  let raydir = p5.Vector.fromAngle(-PI/5);

  for (let l = 0; l <= 740; l += 2) {
    let sigma = 100;
    let r = map(gaussian(l, 680, sigma), 0, gaussian(680, 680, sigma), 0, 255);
    let g = map(gaussian(l, 560, sigma), 0, gaussian(560, 560, sigma), 0, 255);
    let b = map(gaussian(l, 420, sigma), 0, gaussian(400, 420, sigma), 0, 255);
    let c = color(r, g, b);

    rays.push(new Ray(raypos, raydir, l / 1000, c));
  }
  prism = new Prism(createVector(width/2,height/2),250,100,1.1,0.05);
}

function gaussian(x, mean, sigma) {
  return (1 / sigma / sqrt(2 * PI)) * exp(-0.5 * pow((x - mean) / sigma, 2));
}

function draw() {
  background(0);
  for (let ray of rays) {
    ray.cast(prism.boundaries, 35)
    ray.show();
  }
  prism.show();
}

function mouseClicked(){
  for (let ray of rays) {
    ray.updatePos(mouseX,mouseY);
  }
}
