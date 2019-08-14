//IPAD SCREEN SIZE 
//createCanvas(980, 800); 

var mic, fft, cnv, input, points, backgroundColorPicker;

//Spectrum
var divisions = 5;
var speed = 1;

//Mic 
var top_zero = false; 
var micOn = true;
var buttons = [];
var buttonState = [];
var soundFile = [];
var NumButtons = 5;
var wave = [];

//Zoom 
var scaling = 1; 


//Global Setup for Bottom FFT (Landscape Frequency)
function setup() {
  //for safari use of microphone
  userStartAudio();

  //cnv = createCanvas(windowWidth/1.2, windowHeight/2);
  cnv = createCanvas(980 - (139), 400); 
  cnv.position(220, 400); 


  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
}

////////////////////////////////////////////////////////////////////////////////

function draw() {
  noFill();

  //Zoom function??? 
  //scaling = mouseX/100; 

  //variable to pinpoint correct heights of sound
  var h = height/divisions;
  var spectrum = fft.analyze();
  var newBuffer = [];
  var scaledSpectrum = splitOctaves(spectrum, 12);
  var len = scaledSpectrum.length;
  
  //aesthetics
  stroke(rline_slide.value(),gline_slide.value(),bline_slide.value(),100);
  background(r_slide.value(),g_slide.value(),b_slide.value(),1);

  // copy before clearing the background
  copy(cnv,0,0,width,height,0,speed,width,height);

  //draw shape
  beginShape();

    // one at the far corner
    curveVertex(0, h);

    for (var i = 0; i < len; i++) {
      var point = smoothPoint(scaledSpectrum, i, 2);
      var x = map(i, 0, len-1, 0, width);
      var y = map(point, 0, 255, h+150, 0);
      curveVertex(x, y);
    }

    // one last point at the end
    curveVertex(width, h);

  endShape();
}

  
function splitOctaves(spectrum, slicesPerOctave) {
  fft.analyze(); 

  var scaledSpectrum = [];
  var len = spectrum.length;

  // default to thirds
    //optional adjustment of spectrum points dependent of frequency ranges
  if (top_zero == false) {
    if (fft.getEnergy("treble") == true) {
      points = trebleslider.value();
    }

  else if (fft.getEnergy("bass") == true) {
      points = bassslider.value();
    }

  else {
      if (fft.getEnergy("lowMid") == true) {
        points = bassslider.value(); 
      }
      else if (fft.getEnergy("highMid") == true) {
        points = trebleslider.value(); 
      }
      else {
        points = midslider.value();
      }  
    }
  } 
  else{
    points = 0; 
  }

  //print("array", trebleslider.value(), bassslider.value(), midslider.value()); 
  //print(points);
  var nthRootOfTwo = Math.pow(2, 1/ points);

  // the last N bins get their own 
  var lowestBin = slicesPerOctave;

  var binIndex = len - 1;
  var i = binIndex;


  while (i > lowestBin) {
    var nextBinIndex = round( binIndex/nthRootOfTwo );

    if (nextBinIndex === 1) return;

    var total = 0;
    var numBins = 0;

    // add up all of the values for the frequencies
    for (i = binIndex; i > nextBinIndex; i--) {
      total += spectrum[i];
      numBins++;
    }

    // divide total sum by number of bins
    var energy = total/numBins;
    scaledSpectrum.push(energy);

    // keep the loop going
    binIndex = nextBinIndex;
  }

  // add the lowest bins at the end
  for (var j = i; j > 0; j--) {
    scaledSpectrum.push(spectrum[j]);
  }

  // reverse so that array has same order as original array (low to high frequencies)
  scaledSpectrum.reverse();

  return scaledSpectrum;
}


// average a point in an array with its neighbors
function smoothPoint(spectrum, index, numberOfNeighbors) {

  // default to 2 neighbors on either side
  var neighbors = numberOfNeighbors || 2;
  var len = spectrum.length;

  var val = 0;

  // start below the index
  var indexMinusNeighbors = index - neighbors;
  var smoothedPoints = 0;

  for (var i = indexMinusNeighbors; i < (index+neighbors) && i < len; i++) {
    // if there is a point at spectrum[i], tally it
    if (typeof(spectrum[i]) !== 'undefined') {
      val += spectrum[i];
      smoothedPoints++;
    }
  }

  val = val/smoothedPoints;

  return val;
}

////////////////////////////////////////////////////////////////////////////////

//Where all descriptions and text go
var side_bar = function(p) { 
  var side_cnv; 
  var header_x = 10; 
  var descriptor_x = 150;

  p.setup = function() {
    side_cnv = p.createCanvas(220, 800); 
    side_cnv.position(0,0);
    p.background(192,192,192,100);
    p.noLoop();

    micButton = createDiv('Mic ON');
    micButton.class('button_style');
    micButton.mousePressed(restartMic);
    micButton.position(10, 80);

    // Create a set of buttons to record/play sounds
  for (i=0; i<NumButtons; i++) {
    buttons[i] = createDiv('Record sound '+ (i+1));
    buttons[i].class('button_style');
    buttons[i].mousePressed( toggleButton(i) );
    buttons[i].position(10,i*45 + 125);
    buttonState[i] = 0;
    
    // this sound file will be used to
    // playback & save the recording
    soundFile[i] = new p5.SoundFile();      
  }

    //Frequency Sliders
    bassslider = createSlider(0,15,3); 
    bassslider.position(header_x, 430); 

    midslider = createSlider(0,15,3); 
    midslider.position(header_x, 450); 

    trebleslider = createSlider(0,15,12); 
    trebleslider.position(header_x, 470); 

    //Stroke Sliders
    rline_slide = createSlider(0, 255, 255); 
    rline_slide.position(header_x, 580); 

    gline_slide = createSlider(0,255, 119); 
    gline_slide.position(header_x, 600); 

    bline_slide = createSlider(0,255,0); 
    bline_slide.position(header_x, 620); 

    //Background Sliders
    r_slide = createSlider(0, 255, 255); 
    r_slide.position(header_x, 670); 

    g_slide = createSlider(0,255, 255); 
    g_slide.position(header_x, 690); 

    b_slide = createSlider(0,255,255); 
    b_slide.position(header_x, 710); 
  }

  p.draw = function() {
    p.fill(255,255,255); 
    p.textFont('Baskerville');

    //Headers
    p.textSize(36); 
    p.text('AudioWorks', header_x,35);

    //Sub Headers
    p.textSize(24); 
    p.text("Sound Recorder", header_x, 70); 
    p.text("Frequency Adjuster", header_x, 380); 
    p.text("Color Adjuster", header_x, 525); 

    //General Text Size 
    p.textSize(14);

    //Frequency Blurb
    p.text("Slide through values 0 to 15", header_x,400);
    p.text("to change frequency range input", header_x, 415);
    
    //frequency slider descriptions
    p.text("Bass", descriptor_x, 442); 
    p.text("Mid", descriptor_x, 462);  
    p.text("Treble", descriptor_x, 482);

    //colour picker description
    p.text("Change the line/background color", header_x, 545); 

    // //colour slider descriptions
    p.text("Line Color", header_x, 570); 
    p.text("Red", descriptor_x, 594); 
    p.text("Green", descriptor_x, 614); 
    p.text("Blue", descriptor_x, 634); 

    p.text("Background Color", header_x, 660); 
    p.text("Red", descriptor_x, 684); 
    p.text("Green", descriptor_x, 704); 
    p.text("Blue", descriptor_x, 724); 

  }

}

////////////////////////////////////////////////////////////////////////////////

//Isolated setup for Top Waveform 
var o_sketch = function(p) { 
  p.x = 100; 
  p.y = 100;  
  p.mic; 
  p.fft; 
  p.trigger;
  p.working = true; 
  var o_cnv; 

  p.setup = function() {
    o_cnv = p.createCanvas(980 - (139), 400);
    o_cnv.position(220,0); 
    
    p.mic = new p5.AudioIn();
    p.fft = new p5.FFT(0.8, 2048);

    p.mic.start(); 
    p.fft.setInput(p.mic); 

  }
  p.draw = function() {
    p.strokeWeight(2);
    p.noFill();

    p.stroke(rline_slide.value(),gline_slide.value(),bline_slide.value());
    p.background(r_slide.value(),g_slide.value(),b_slide.value());

    //Dr. Kim's code don't know where to utilise
    // var spectrum = p.fft.analyze();
    // var subbands = p.fft.getOctaveBands(12,55.0);
    // var energy = p.fft.logAverages(subbands);

    var wave = p.fft.waveform();
  
    p.beginShape();
    for (i = 0; i < wave.length; i++) {
      vertex(i, map(wave[i]*scaling, 0, 1, 200, 100));
      }
      p.endShape();
    }
}

////////////////////////////////////////////////////////////////////////////////
var side_bar = new p5(side_bar); 
var space = new p5(); 
var o_p5 = new p5(o_sketch);

///////////////////////////////////////////////////////////////////////////////

//Dr. Kim's toggle button for Mic button 
function toggleButton(idx) {

  return function() {

    // make sure user enabled the mic
    if (buttonState[idx] === 0 && micOn) {
      // record to our p5.SoundFile
      recorder.record(soundFile[idx]);

      buttons[idx].html('Stop recording'); 
      buttons[idx].style('background-color','#ff0000');
      buttonState[idx] = 1;
    }
    else if (buttonState[idx] === 1) {

      // stop recorder and
      // send result to soundFile
      recorder.stop();

      buttons[idx].html('Play sound '+idx);
      buttons[idx].style('background-color','#00cc00');
      buttonState[idx] = 2;
    }
    else if (buttonState[idx] === 2) {
      mic.stop();
      micOn = false;
      micButton.style('background-color','#888888');

      fft.setInput(soundFile[idx]);
      soundFile[idx].play(); // play the result!    
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

//Dr Kim's audio toggle
function restartMic() {
  if ( micOn == true ) {
    mic.start();
    o_p5.mic.start(); 
    micOn = true;
    micButton.html('Mic ON');
    micButton.style('background-color', '#4400ff');
  }
  else {
    mic.stop();
    o_p5.mic.stop(); 
    top_zero = true; 
    micOn = false;
    micButton.html('Mic OFF');
    micButton.style('background-color', '#888888');
  }
}

///////////////////////////////////////////////////////////////////////////////

//RESIZE FUNCTION FOR WEB 
// function windowResized() {
//   resizeCanvas(980 - (windowWidth/6 +10), 400);
//   cnv.position(windowWidth/6-20, windowHeight/2); 
//   o_p5.resizeCanvas(980 - (windowWidth/6 +10), 400);
//   o_sketch.position(windowWidth/6-20, windowHeight/2); 
// }

