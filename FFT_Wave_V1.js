var fft_sketch = function(p) {
  p.x = 100;
  p.y = 100;
  p.mic; 
  p.fft;
  p.running = true;  
  
  p.setup = function() {
    p.createCanvas(windowWidth/1.5, windowHeight/2);
    
    p.mic = new p5.AudioIn();
    p.fft = new p5.FFT();

    p.mic.start(); 
    p.fft.setInput(p.mic); 
  }
  p.draw = function() {
    setInterval(resetFFT, 10); 
    p.background(64,201,190);
    p.stroke(26,14,109);
    p.strokeWeight(2);
    p.noFill();
    
    p.spectrum = p.fft.analyze();

    p.beginShape();
    for (p.i = 0; p.i < p.spectrum.length; p.i++) {
      p.vertex(p.i, map(p.spectrum[p.i], 0, 255, p.height, 0));
    }
    p.endShape();
  }
  
}

////////////////////////////////////////////////////////////////////////////////////////

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

var fft_p5 = new p5(fft_sketch);
var o_p5 = new p5(o_sketch);
var space_p5 = new p5();

function windowResized() {
  fft_p5.resizeCanvas(windowWidth/1.5, windowHeight/2); 
  o_p5.resizeCanvas(windowWidth/1.5, windowHeight/2); 

}	

var selection; 

function setup() {
  selection = createSelect(); 
  selection.position(10,10); 
  selection.option("Full View");
  selection.option("Top View"); 
  selection.option("Bottom View"); 
  selection.option("Empty View"); 
  selection.changed(mySelectEvent); 
}

function mySelectEvent() {
  var view = selection.value(); 
  if (view == "Full View") {
    fft_p5.mic.start(); 
    fft_p5.fft.setInput(fft_p5.mic); 
    o_p5.mic.start(); 
    o_p5.fft.setInput(o_p5.mic); 
  }
  else if (view == "Top View") {
    fft_p5.mic.start(); 
    fft_p5.fft.setInput(fft_p5.mic); 
    o_p5.mic.stop(); 
    o_p5.fft.setInput(o_p5.mic); 

  }
  else if (view == "Bottom View") {
    fft_p5.mic.stop(); 
    fft_p5.fft.setInput(fft_p5.mic);
    o_p5.mic.start(); 
    o_p5.fft.setInput(o_p5.mic); 

  }
  else if (view == "Empty View") {
    fft_p5.mic.stop(); 
    fft_p5.fft.setInput(fft_p5.mic); 
    o_p5.mic.stop(); 
    o_p5.fft.setInput(o_p5.mic); 
  }
}

function resetFFT() {
  fft_p5.x = fft_p5.width;
  fft_p5.y = fft_p5.height;
  fft_p5.background(64,201,190);
  
}







