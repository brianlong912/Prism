class Prism {
  constructor(pos, n, r, A, B) {
    this.pos = pos;
    this.r = r;
    this.n = n;
    this.A = A; //Cauchy equation gives the index of refraction for given lambda
    this.B = B; //with the first two terms as f(n) = A + B/lambda^2

    this.boundaries = [];
    let theta0 = PI/2;
    let dtheta = (2 * PI) / this.n;
    for (let i = 0; i < this.n; i++) {
      let theta = theta0 + i * dtheta
      let bposx = this.r * cos(theta);
      let bposy = this.r * sin(theta);
      let bpos = createVector(bposx, bposy);
      bpos.add(this.pos);
      let bdir = p5.Vector.fromAngle(theta);
      let blength = 2 * this.r * tan(PI / this.n);

      this.boundaries.push(new Boundary(bpos, bdir, blength, this.A, this.B));
    }
  }

  show() {
    stroke(255);
    for (let boundary of this.boundaries) {
      boundary.show();
    }
  }
}
