var video;
var vScale = 16;
var particles = [];
var slider;
var go = false;

// noprotect

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture (VIDEO, callbackgo);
  for (var i = 0; i < 200; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
  slider = createSlider(0, 255, 127);
  background(51);
}

function draw() {
  background(51);
  video.loadPixels();
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
  
  if (go) {
   video.size (width / vScale, height / vScale);
  }
}

function callbackgo () {
   go = true;
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.r = random(4, 32);

  this.update = function() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  };

  this.show = function() {
    noStroke();
    var px = floor(this.x / vScale);
    var py = floor(this.y / vScale);
    var col = video.get(px, py);
    //console.log(col);
    fill(col[0], col[1], col[2], slider.value());
    ellipse(this.x, this.y, this.r, this.r);
  };
}
