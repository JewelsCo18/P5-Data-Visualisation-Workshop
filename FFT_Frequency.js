var mic, fft;
var divisions = 5;
var cnv;
var speed = 1;
var input; 
var button; 
var points; //for 3d spectrum and button 
var bassPoints = 3;
var midPoints = 3; 
var treblePoints = 12;
var header;

function setup() {
  cnv = createCanvas(windowWidth/1.2, windowHeight);
  cnv.position((windowWidth/6),0); 
  noFill(); 

  bassinput = createInput(); 
  bassinput.position(10, 35); 
  bassbutton = createButton("Bass Range");  
  bassbutton.position(bassinput.x+bassinput.width, 35); 
  bassbutton.mousePressed(changeBass); 

  midinput = createInput(); 
  midinput.position(10, 55); 
  midbutton = createButton("Mid Range"); 
  midbutton.position(midinput.x+midinput.width,55); 
  midbutton.mousePressed(changeMid); 

  trebleinput = createInput(); 
  trebleinput.position(10, 75); 
  treblebutton = createButton("Treble Range"); 
  treblebutton.position(trebleinput.x+trebleinput.width, 75); 
  treblebutton.mousePressed(changeTreble); 

  button = createButton("Change All"); 
  button.position(10, 100); 
  button.mousePressed(changingPoints); 

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);
}

function changeBass() { 
  bassPoints = bassinput.value(); 
}

function changeMid() { 
  midPoints = midinput.value(); 
}

function changeTreble() { 
  treblePoints = trebleinput.value(); 
}

function changingPoints() {
  treblePoints = trebleinput.value();
  bassPoints = bassinput.value();
  midPoints = midinput.value();
}



////////////////////////////////////////////////////////////////////////////////

function draw() {
  var h = (height/divisions);
  var spectrum = fft.analyze();
  var newBuffer = [];
  stroke(255,119,0,100);

  var scaledSpectrum = splitOctaves(spectrum, 12);
  var len = scaledSpectrum.length;

  background(255,255,255,1);
  // copy before clearing the background
  copy(cnv,0,0,width,height,0,speed,width,height);

  // draw shape
  beginShape();

    // one at the far corner
    curveVertex(0, h);

    for (var i = 0; i < len; i++) {
      var point = smoothPoint(scaledSpectrum, i, 2);
      var x = map(i, 0, len-1, 0, width);
      var y = map(point, 0, 255, h+200, 0);
      curveVertex(x, y);
    }
    curveVertex(width, h);
  endShape();
}

function splitOctaves(spectrum, slicesPerOctave) {
  
  fft.analyze(); 

  var scaledSpectrum = [];
  var len = spectrum.length;

  //opacity
  if (fft.getEnergy("treble") == true) {
      if (treblePoints == null) {
        points = slicesPerOctave || 12;
      }
      else {
        points = treblePoints;
      }
    }
    else if (fft.getEnergy("bass") == true) { 
      if (bassPoints == null) {
        points = slicesPerOctave || 3;
      }
      else {
        points = bassPoints;
      }
    }
    else { 
      if (midPoints == null) {
        points = slicesPerOctave || 3;
      }
      else {
        points = midPoints;
      }
    }

  print("array", treblePoints, bassPoints, midPoints); 
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


// function windowResized() {
//   resizeCanvas(windowWidth/1.2, windowHeight);
//   cnv.position(windowWidth/6,0); 
//   background(255,255,255,1); 
// }

