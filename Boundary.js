class Boundary {
  constructor(pos, dir, length, A, B, toVacuum) {
    this.pos = pos; //Position of boundary
    this.dir = dir.normalize(); //direction of normal of the boundary
    this.length = length; //length of boundary
    this.A = A; //first term of the Cauchy equation (n = A + B/lambda^2)
    this.B = B; //second term of the caucy equation
    this.toVacuum = toVacuum;

    this.start = createVector(
      (this.dir.y * this.length) / 2,
      (-this.dir.x * this.length) / 2
    );
    this.start.add(this.pos);
    this.end = createVector(
      (-this.dir.y * this.length) / 2,
      (this.dir.x * this.length) / 2
    );
    this.end.add(this.pos);
  }

  nrefraction(lambda) {
    return this.A + this.B / (lambda * lambda);
  }

  show() {
    fill(255);
    stroke(255);
    strokeWeight(1);
    line(this.start.x,this.start.y,this.end.x,this.end.y);
  }
}
