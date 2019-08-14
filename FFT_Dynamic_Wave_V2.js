var mic; // input sources, press T to toggleInput()
var fft;
var smoothing = 0.8; // play with this, between 0 and .99
var binCount = 1024; // size of resulting FFT array. Must be a power of 2 between 16 an 1024
var particles =  new Array(binCount);


function setup() {
  c = createCanvas(windowWidth/1.5, windowHeight/2);
  noStroke();

  selection = createSelect(); 
  selection.position(10,10); 
  selection.option("Full View");
  selection.option("Top View"); 
  selection.option("Bottom View"); 
  selection.option("Empty View"); 
  selection.changed(mySelectEvent); 

  mic = new p5.AudioIn();
  mic.start();

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);

  // instantiate the particles.
  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(0, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function draw() {
  background(64,201,190,100);

  // returns an array with [binCount] amplitude readings from lowest to highest frequencies
  var spectrum = fft.analyze(binCount);

  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

    // update values based on amplitude at this part of the frequency spectrum
    particles[i].update( thisLevel );

    // draw the particle
    particles[i].draw();

    // update x position (in case we change the bin count while live coding)
    particles[i].position.x = map(i, 0, binCount, 0, width * 2);
  }
}

var Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0, 5) );
  this.color = [random(0,100), random(0,255), random(0,255)];
}

var theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale * theyExpand;

}

Particle.prototype.draw = function() {
  fill(this.color);
  ellipse(
    this.position.x, this.position.y,
    this.diameter, this.diameter
  );
}

var o_sketch = function(p) { 
  p.x = 100; 
  p.y = 100;  
  p.mic; 
  p.fft; 
  p.trigger;
  p.working = true; 

  p.setup = function() {
    p.createCanvas(windowWidth/1.5, windowHeight/2);
    p.background(200);
    
    p.mic = new p5.AudioIn();
    p.fft = new p5.FFT(0.8, 2048);

    p.mic.start(); 
    p.fft.setInput(p.mic); 

  }
  p.draw = function() {
    p.strokeWeight(2);
    p.noFill();
    p.stroke(26,14,109);
    p.background(64,201,190);
    p.waveform = p.fft.waveform(); 
    p.beginShape();
    p.trigger = 0;

  for (i = 0; i < p.waveform.length; i++){
      if ((p.waveform[i] > 0) && (p.waveform[i-1] <= 0) && (p.trigger == 0))
      {
        p.trigger = 1;
        p.firstPos = i;
      }
      if (p.trigger == 1)
      {
        p.x = map((i - p.firstPos), 0, p.waveform.length, 0, p.width * 3);
        p.y = map(p.waveform[i], -1, 1, p.height, 0);
      }
      p.vertex(p.x, p.y);
    }
    p.endShape();

  }
}

var space_p5 = new p5();
var o_p5 = new p5(o_sketch);

function mySelectEvent() {
  var view = selection.value(); 
  if (view == "Full View") {
    mic.start(); 
    fft.setInput(mic); 
    o_p5.mic.start(); 
    o_p5.fft.setInput(o_p5.mic); 
  }
  else if (view == "Top View") {
    mic.start(); 
    fft.setInput(mic); 
    o_p5.mic.stop(); 
    o_p5.fft.setInput(o_p5.mic); 

  }
  else if (view == "Bottom View") {
    mic.stop(); 
    fft.setInput(mic);
    o_p5.mic.start(); 
    o_p5.fft.setInput(o_p5.mic); 

  }
  else if (view == "Empty View") {
    mic.stop(); 
    fft.setInput(mic); 
    o_p5.mic.stop(); 
    o_p5.fft.setInput(o_p5.mic); 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  o_p5.resizeCanvas(windowWidth/1.5, windowHeight/2);
}


