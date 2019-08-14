//IPAD SCREEN SIZE 
//createCanvas(980, 800); 

var mic, fft, cnv, input, points, backgroundColorPicker;

//Spectrum Vars
var divisions = 5;
var speed = 1;

//Mic Vars
var top_zero = false; 
var micOn = false;
var buttons = [];
var buttonState = [];
var soundFile = [];
var NumButtons = 10;
var wave = [];
var mic = new p5.AudioIn(); 
var paused = 0; 
var curr_points = [12,3,3]; 

//Zoom variables 
var scaling = 1;
var move_position = 0; 
var temp_x = 0; 
var temp_y = 0; 
var start_pos; 

//Button vars
var header_x = 10;
var slide_x = 15;  
var descriptor_x = 160;
var frequency_bool = false; 
var sound_bool = false; 
var colour_bool = false; 
var synthesis_bool = false;
var last_button = 219; 

//synthesis 
var sliderNums = 16;  
var sliders = []; 
var oscillators = []; 

//Colour Vars; 
var curr_stroke = [255,119,0]; //rgb
var curr_background = [255,255,255]; //rgb

//test vars
var scaly = 1; 


//Global Setup for Bottom FFT (Landscape Frequency)
function setup() {
  //for safari use of microphone
  userStartAudio();

  //cnv = createCanvas(windowWidth/1.2, windowHeight/2);
  cnv = createCanvas(980 - (139), 400); 
  cnv.position(220, 400); 

  fft_b_zoom_in = createButton("+"); 
  fft_b_zoom_in.position(990,420); 
  //fft_b_zoom_in.mousePressed(fft_zoom_in);  

  fft_b_zoom_out = createButton("-"); 
  fft_b_zoom_out.position(1015,420); 
  //fft_b_zoom_out.mousePressed(fft_zoom_out); 

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

  //variable to pinpoint correct heights of sound
  var h = height/divisions;
  var spectrum = fft.analyze();
  var newBuffer = [];
  var scaledSpectrum = splitOctaves(spectrum, 12);
  var len = scaledSpectrum.length;
  
  //aesthetics
  if (colour_bool == true) {
    stroke(rline_slide.value(),gline_slide.value(),bline_slide.value(),100);
    background(red_slide.value(),green_slide.value(),blue_slide.value(),1);
    curr_stroke[0] = rline_slide.value();
    curr_stroke[1] = gline_slide.value();
    curr_stroke[2] = bline_slide.value();   
    curr_background[0] = red_slide.value();
    curr_background[1] = green_slide.value();
    curr_background[2] = blue_slide.value(); 
  }
  else{
    stroke(curr_stroke[0],curr_stroke[1],curr_stroke[2],100); 
    background(curr_background[0],curr_background[1],curr_background[2],1); 
  }

  // copy before clearing the background
  copy(cnv,0,0,width,height,0,speed,width,height);

  if (paused == 0) {
    speed = 1; 
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
  else{
    speed = 0;
  }
}

  
function splitOctaves(spectrum, slicesPerOctave) {
  fft.analyze(); 

  var scaledSpectrum = [];
  var len = spectrum.length;

  // default to thirds
    //optional adjustment of spectrum points dependent of frequency ranges
  if (frequency_bool == true) {
    if (top_zero == false) {
      if (fft.getEnergy("treble") == true) {
        points = trebleslider.value();
        curr_points[0] = trebleslider.value(); 
      }
      else if (fft.getEnergy("bass") == true) {
          points = bassslider.value();
          curr_points[2] = bassslider.value(); 
        }

      else {
          if (fft.getEnergy("lowMid") == true) {
            points = bassslider.value(); 
            curr_points[2] = bassslider.value(); 
          }
          else if (fft.getEnergy("highMid") == true) {
            points = trebleslider.value(); 
            curr_points[0] = trebleslider.value(); 
          }
          else {
            points = midslider.value();
            curr_points[1] = midslider.value(); 
          }  
        }
      } 
    else{
      points = 0; 
    }
  }
  else{
    if (fft.getEnergy("treble") == true) { 
      points = curr_points[0]; 
    }
    else if (fft.getEnergy("bass") == true) {
          points = curr_points[2];
        }

    else {
        if (fft.getEnergy("lowMid") == true) {
          points = curr_points[2];
        }
        else if (fft.getEnergy("highMid") == true) {
          points = curr_points[0]; 
        }
        else {
          points = curr_points[1]; 
        }  
      }
  }

  //print("array", trebleslider.value(), bassslider.value(), midslider.value()); 
  //print(points);
  var nthRootOfTwo = Math.pow(2, 1/points);

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

//Isolated setup for Top Waveform 
var o_sketch = function(p) { 
  p.x = 100; 
  p.y = 100;  
  p.fft; 
  p.trigger;
  p.working = true; 
  var o_cnv; 

  p.setup = function() {
    o_cnv = p.createCanvas(980 - (139), 400);
    o_cnv.position(220,0); 
    
    p.fft = new p5.FFT(0.8, 2048);

    p.fft.setInput(mic);

    p.o_zoom_in = createButton("+"); 
    p.o_zoom_in.position(990,20); 
    p.o_zoom_in.mousePressed(zoom_in);  

    p.o_zoom_out = createButton("-"); 
    p.o_zoom_out.position(1015,20); 
    p.o_zoom_out.mousePressed(zoom_out); 
    
  }
  p.draw = function() {
    if (paused==0) {
      p.strokeWeight(2);
      p.noFill();

      if (colour_bool == true) {
        p.stroke(rline_slide.value(),gline_slide.value(),bline_slide.value());
        p.background(red_slide.value(),green_slide.value(),blue_slide.value());
      }
      else{
        p.stroke(curr_stroke[0],curr_stroke[1],curr_stroke[2]); 
        p.background(curr_background[0],curr_background[1],curr_background[2]); 
      }

      if (p.mouseX > 0 && p.mouseX < 980 && p.mouseY < 400 && p.mouseY > 0) {
        touchMoved(); 
      }

      var wave = p.fft.waveform();
      p.beginShape();
      for (start_pos = 0; start_pos < wave.length; start_pos++) {
        vertex(start_pos + move_position, map(wave[start_pos]*scaling, 0, 1, 200, 100));
        }
        p.endShape();
      }  
    }  
}

////////////////////////////////////////////////////////////////////////////////

//Where all descriptions and text go
var side_bar = function(p) { 

  p.setup = function() {
    var side_cnv = p.createCanvas(220, 800); 
    side_cnv.position(0,0);
    p.noLoop();

    micButton = createDiv('Mic ON');
    micButton.class('button_style');
    micButton.mousePressed(restartMic);
    micButton.position(10, 50); 

    sound_button = createDiv("Sound Recorder"); 
    sound_button.class('button_style'); 
    sound_button.mousePressed(sound_recorder); 
    sound_button.position(10, 90); 

    frequency_button = createDiv("Frequency Adjuster"); 
    frequency_button.class('button_style'); 
    frequency_button.mousePressed(frequency_sliders); 
    frequency_button.position(10, 130); 

    colour_button = createDiv("Colour Adjuster"); 
    colour_button.class('button_style'); 
    colour_button.mousePressed(colour_adjustment); 
    colour_button.position(10, 170); 

    synthesis_button = createDiv("Synthesizer"); 
    synthesis_button.class('button_style'); 
    synthesis_button.mousePressed(synthesizer); 
    synthesis_button.position(10, 210); 
    
  }

  p.draw = function() {
    p.fill(255,255,255); 
    p.textFont('Baskerville');
    var last_button = synthesis_button.y +synthesis_button.height/2; 

    //Headers
    p.textSize(36); 
    p.text('AudioWorks', header_x,35);

    //General Text Size 
    p.textSize(14);

    if (sound_bool == true) { 
      p.text("Record and play back sound", header_x, last_button+ 45); 
    }

    if (frequency_bool == true){
      //Frequency Blurb
      p.text("Slide through values 0 to 15", header_x, last_button + 45);
      p.text("to change frequency range input", header_x, last_button+ 60);

      // //frequency slider descriptions
      p.text("Bass", descriptor_x, last_button + 75); 
      p.text("Mid", descriptor_x, last_button + 95);  
      p.text("Treble", descriptor_x, last_button + 115);
    }
    
    if (colour_bool == true) {
      //colour picker description
      p.text("Change the line/background color", header_x, last_button + 45); 

      //colour slider descriptions
      p.text("Line Color", header_x, last_button + 65); 
      p.text("Red", descriptor_x, last_button + 80); 
      p.text("Green", descriptor_x, last_button + 110); 
      p.text("Blue", descriptor_x, last_button + 140); 

      p.text("Background Color", header_x, last_button + 180); 
      p.text("Red", descriptor_x, last_button + 200); 
      p.text("Green", descriptor_x, last_button + 230); 
      p.text("Blue", descriptor_x, last_button + 260); 
    }
    
    if (synthesis_bool == true) { 
      p.text("Synthesize your own sound", header_x, last_button + 45); 
    }

  }

}

////////////////////////////////////////////////////////////////////////////////

var side_bar = new p5(side_bar); 
var space = new p5(); 
var o_p5 = new p5(o_sketch);

///////////////////////////////////////////////////////////////////////////////

//Zoom functions
function zoom_in() {
  scaling += 1;
}

function zoom_out() {
  scaling -= 1; 
}

//Don't know if this is working!!!
function touchMoved(){

  // print(move_position); 
  // if (scaling != 1 ) {
  //   if (mouseX < temp_x && move_position >= 0){
  //     move_position += 10;
  //     temp_x = mouseX  
  //   }
  //   else if (mouseX >temp_x && move_position >= -1205) {
  //       move_position -= 10;
  //       temp_x = mouseX;
  //   }

  //   // if mouseY > temp_y) {

  //   // }
  // }
}

///////////////////////////////////////////////////////////////////////////////

//Button functions

function sound_recorder() { 
  //Create a set of buttons to record/play sounds
  sound_bool = !sound_bool 

  if (sound_bool == true) {
    sound_button.style('background-color', '#4400ff');
    side_bar.redraw(); 

    for (i=0; i<NumButtons; i++) {
      buttons[i] = createDiv('Record sound '+ (i+1));
      buttons[i].class('mic_style');
      buttons[i].mousePressed( toggleButton(i) );
      buttons[i].position(10,i*45 + last_button + 60);
      buttonState[i] = 0;
      
      // this sound file will be used to
      // playback & save the recording
      soundFile[i] = new p5.SoundFile();      
    }
  }

  else{
    sound_button.style('background-color', '#C0C0C0');
    for (i=0; i<NumButtons; i++) {
      buttons[i].hide(); 
    }
    side_bar.clear(); 
    side_bar.redraw();
  }
}

function frequency_sliders() { 
  frequency_bool = !frequency_bool;

  if (frequency_bool == true) {
    frequency_button.style('background-color', '#4400ff');

    side_bar.redraw(); 
    //Frequency Sliders
    trebleslider = createSlider(0,15,curr_points[0]); 
    trebleslider.position(slide_x, last_button + 105); 

    midslider = createSlider(0,15,curr_points[1]); 
    midslider.position(slide_x, last_button + 85 ); 

    bassslider = createSlider(0,15,curr_points[2]); 
    bassslider.position(slide_x, last_button + 65); 
      
  }
  else{
    frequency_button.style('background-color', '#ffffff');

    bassslider.hide(); 
    midslider.hide(); 
    trebleslider.hide();
    side_bar.clear(); 
    side_bar.redraw(); 
  }
  
}

function colour_adjustment() { 
  colour_bool = !colour_bool;

  if (colour_bool == true) {
    colour_button.style('background-color', '#4400ff');

    side_bar.redraw(); 

    //Stroke Sliders
    rline_background = createDiv("red"); 
    rline_background.class("red_bar"); 
    rline_background.position(header_x, last_button + 70); 

    rline_slide = createSlider(0, 255, curr_stroke[0]); 
    rline_slide.position(slide_x, last_button + 70); 

    //////

    gline_background = createDiv("green"); 
    gline_background.class("green_bar"); 
    gline_background.position(header_x, last_button + 100);

    gline_slide = createSlider(0,255, curr_stroke[1]); 
    gline_slide.position(slide_x, last_button + 100); 

    ////

    bline_background = createDiv("blue"); 
    bline_background.class("blue_bar"); 
    bline_background.position(header_x, last_button + 130);

    bline_slide = createSlider(0,255,curr_stroke[2]); 
    bline_slide.position(slide_x, last_button + 130); 

    //Background Sliders

    red_background = createDiv("red"); 
    red_background.class("red_bar"); 
    red_background.position(header_x, last_button + 190); 

    red_slide = createSlider(0, 255, curr_background[0]); 
    red_slide.position(slide_x, last_button + 190); 

    /////////

    green_background = createDiv("_"); 
    green_background.class("green_bar"); 
    green_background.position(header_x, last_button + 220)

    green_slide = createSlider(0,255, curr_background[1]); 
    green_slide.position(slide_x, last_button + 220); 

    /////////

    blue_background = createDiv("blue"); 
    blue_background.class("blue_bar"); 
    blue_background.position(header_x, last_button + 250)

    blue_slide = createSlider(0,255,curr_background[2]); 
    blue_slide.position(slide_x, last_button + 250); 
  }
  else{
    colour_button.style('background-color', '#C0C0C0');

    rline_background.hide(); 
    gline_background.hide(); 
    bline_background.hide();

    rline_slide.hide(); 
    gline_slide.hide(); 
    bline_slide.hide(); 

    red_background.hide(); 
    green_background.hide(); 
    blue_background.hide(); 

    red_slide.hide(); 
    green_slide.hide(); 
    blue_slide.hide(); 

    side_bar.clear(); 
    side_bar.redraw();  

  }
}

function synthesizer() {
  synthesis_bool = !synthesis_bool; 

  if (synthesis_bool == true) { 
    synthesis_button.style('background-color', '#4400ff');
    paused = 1;
    clear(); 
    for (i=0; i<sliderNums; i++) {
      sliders[i] = createSlider(0, 80, 0); 
      sliders[i].size(380);
      sliders[i].style('transform', 'rotate(-90deg'); 
      sliders[i].position(50+ i*47, 590); 

      oscillators[i] = new p5.Oscillator(440*i, 'sine'); 
      oscillators[i].amp(sliders[i].value()); 
      oscillators[i].start(); 
    }
  }

  else{ 
    synthesis_button.style('background-color', '#C0C0C0');
    paused = 0; 
    for (i = 0; i < sliderNums; i++) { 
      sliders[i].hide(); 
      oscillators[i].stop(); 
    }
  }
}

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
      micButton.html("Mic OFF"); 
      fft.setInput(soundFile[idx]);
      soundFile[idx].play(); // play the result!    
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

//Dr Kim's audio toggle
function restartMic() {
  if ( !micOn ) {
    paused = 0;
    mic.start();
    micOn = true;
    micButton.html('Mic ON');
    micButton.style('background-color', '#4400ff');
  }
  else {
    paused = 1; 
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