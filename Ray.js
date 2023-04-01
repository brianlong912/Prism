class Ray {
  constructor(pos, dir, lambda, color) {
    this.pos = pos;
    this.dir = dir.normalize();
    this.lambda = lambda;
    this.color = color;
    this.refracted;
    this.reflected;
    this.collision
  }

  show() {
    stroke(this.color);
    strokeWeight(1);
    if (this.collision) {
      line(this.pos.x, this.pos.y, this.reflected.pos.x, this.reflected.pos.y);
      this.reflected.show();
      if (this.refracted){
        this.refracted.show();
      }
    } else {
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + 400 * this.dir.x,
        this.pos.y + 400 * this.dir.y
      );
    }
  }

  equals(ray) {
    return (
      this.pos.equals(ray.pos) &&
      this.dir.equals(ray.dir) &&
      this.lambda == ray.lambda
    );
  }

  updateDir(x, y) {
    this.dir.set(x - this.pos.x, y - this.pos.y);
    this.dir.normalize();
  }

  updatePos(x, y) {
    this.pos.set(x, y);
  }

  intersect(boundary) {
    const x1 = this.pos.x;
    const y1 = this.pos.y;
    const x2 = this.pos.x + this.dir.x;
    const y2 = this.pos.y + this.dir.y;

    const x3 = boundary.start.x;
    const y3 = boundary.start.y;
    const x4 = boundary.end.x;
    const y4 = boundary.end.y;

    /* Calculation of intersecting line segments */
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && u > 0 && u < 1) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt.add(this.dir);
    } else {
      return;
    }
  }

  cast(boundaries, maxReflect) {
    maxReflect--;
    if (!maxReflect) {
      return;
    }

    if (this.color.levels[3] < 5) {
      return;
    }

    let closestP = null;
    let closestB = null;
    let record = Infinity;
    for (let b of boundaries) {
      let pt = this.intersect(b);
      if (pt) {
        let d = p5.Vector.dist(this.pos, pt);
        if (d < record) {
          record = d;
          closestP = pt;
          closestB = b;
        }
      }
    }
    
    if (!closestP) {
      this.collision = false;
      return;
    }
    
    let dirRefracted = this.refract(closestB);
    let dirReflected = this.reflect(closestB);
    
    /*Trying out decreasing the transmittance intensity */
    let incidence = createVector(closestB.dir.y, -closestB.dir.x);
    if (incidence.dot(this.dir) < 0) {
      incidence.mult(-1);
    }
    let thetai = this.dir.angleBetween(incidence);
    let R0 = pow(1-closestB.nrefraction(this.lambda)/(1+closestB.nrefraction(this.lambda)),2);
    let reflectance = R0 + (1 -R0)*pow(1-cos(thetai),5);
    let T = 1-reflectance;

    let refracted_newc = color(this.color.levels[0],this.color.levels[1],this.color.levels[2],this.color.levels[3]);
    let reflected_newc = color(this.color.levels[0],this.color.levels[1],this.color.levels[2],this.color.levels[3]);
    
    refracted_newc.setAlpha(T*this.color.levels[3]);
    reflected_newc.setAlpha(reflectance*this.color.levels[3])

    /* There are some rounding errors that cause problems. Offsetting the new position by the direction helps */
    if (dirRefracted.x != 0 && dirRefracted.y != 0)
    {
      this.refracted = new Ray(p5.Vector.add(closestP,dirRefracted), dirRefracted, this.lambda, refracted_newc);
      this.refracted.cast(boundaries, maxReflect);
    }
    this.reflected = new Ray(p5.Vector.add(closestP,dirReflected), dirReflected, this.lambda, reflected_newc);
    this.reflected.cast(boundaries, maxReflect);
    this.collision = true;
    return;
  }

  refract(boundary) {
    let incidence = boundary.dir.copy(); // createVector(boundary.dir.y, -boundary.dir.x);
    let n = boundary.nrefraction(this.lambda);
    if (incidence.dot(this.dir) < 0) {
      incidence.mult(-1);
      n = 1 / n;
    }
    let thetai = this.dir.angleBetween(incidence);
    let thetar = asin(sin(thetai) * n);

    let newx = incidence.x * cos(thetar) + incidence.y * sin(thetar);
    let newy = -incidence.x * sin(thetar) + incidence.y * cos(thetar);

    let dir = createVector(newx, newy);
    return dir.normalize();
  }

  reflect(boundary) {
    let incidence = createVector(boundary.dir.y, -boundary.dir.x);
    if (incidence.dot(this.dir) < 0) {
      incidence.mult(-1);
    }

    let dir = this.dir.copy();
    let dot = 2*this.dir.dot(incidence);
    dir.sub(incidence.mult(2*this.dir.dot(incidence)));
    dir.mult(-1);

    return dir.normalize();
  }
}
