var ship;
var bullets = [];
var asteroids = [];
var difficulty = 0.01;
var score = 0;

class Asteroid {
  constructor(_pos, _vel) {
    this.pos = _pos;
    this.vel = _vel;
    this.radius = random(10, 40);
  }
  show() {
    circle(this.pos.x, this.pos.y, this.radius);
  }
  move() {
    this.pos.add(this.vel);
  }
  death() {
    if (asteroids.length > 100) {
      asteroids.shift();
    }
  }
  bulletCollision(id) {
    for (let i = 0; i < bullets.length; i++) {
      if (this.pos.copy().dist(bullets[i].pos.copy()) < this.radius + bullets[i].radius) {
        asteroids.splice(id, 1);
        bullets.splice(i,1);
        score++;
        if(score % 100){
          difficulty += 0.01;
        }
      }
    }
  }
}


class Bullet {
  constructor(_pos, _vel) {
    this.pos = _pos;
    this.vel = _vel;
    this.timer = millis();
    this.radius = 3;
  }
  show() {
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
  move() {
    this.pos.add(this.vel);
  }
  death() {
    if (millis() - this.timer > 5000) {
      bullets.shift();
    }
  }
}

class Ship {
  constructor(_pos, _vel, _theta) {
    this.pos = _pos;
    this.vel = _vel;
    this.theta = _theta;
  }
  show() {
    stroke(255);
    strokeWeight(3);
    let x1 = this.pos.x;
    let y1 = this.pos.y;
    let x2 = this.pos.x + 5 * this.vel.copy().normalize().x;
    let y2 = this.pos.y + 5 * this.vel.copy().normalize().y;
    line(x1, y1, x2, y2);
  }

  rotate() {
    if (keyIsDown(74)) {
      this.theta -= 0.005;
      this.vel.rotate(this.theta);
    }
    if (keyIsDown(76)) {
      this.theta += 0.005;
      this.vel.rotate(this.theta);
    }
  }
}


function setup() {
  createCanvas(400, 400);
  let p = createVector(width / 2, height / 2);
  let v = createVector(0, 0.001);
  let t = 0.0;
  ship = new Ship(p, v, t);
}

function draw() {
  background(0);
  ship.show();
  ship.rotate();
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
    bullets[i].death();
  }
  if (random(0, 1) < difficulty) {
    print("hope");
    let sign = -1 + 2 * floor(random(0, 2));
    let x = width / 2 + sign * random(width / 2, 100 + width / 2);
    sign = -1 + 2 * floor(random(0, 2));
    let y = height / 2 + sign * random(height / 2, 100 + height / 2);
    let p = createVector(x, y);
    print(p);
    // let p = createVector(100,100);
    let d = createVector(random(0, width), random(0, height));
    // let v = p.copy().sub(d.copy()).normalize();
    let v = d.copy().sub(p.copy()).normalize();
    asteroids.push(new Asteroid(p, v));
  }
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].show();
    asteroids[i].move();
    asteroids[i].death();
    asteroids[i].bulletCollision(i);
  }
}

function keyPressed() {
  if (key == 'i') {
    let p = ship.pos.copy().add(ship.vel.copy());
    let v = ship.vel.copy().normalize();
    bullets.push(new Bullet(p, v));
  }
} 