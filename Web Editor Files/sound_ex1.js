var mic, fft, trigger;
var paused = false;


//DATA//
function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 2048);
  fft.setInput(mic);
  
}

//VISUAL//

function draw() {
  
  if (!paused)
  {
    background(80);

    var waveform = fft.waveform();  // analyze the waveform
    
    beginShape();
    strokeWeight(2); //how thick line is 
    noFill(); //if you want the waveform to be filled in 
    stroke(109,255,245); //colour of the line
    trigger = 0;
    for (var i = 0; i < waveform.length; i++){

      if ((waveform[i] > 0) && (waveform[i-1] <= 0) && (trigger == 0))
      {
        trigger = 1;
        firstPos = i;
      }

      if (trigger == 1)
      {

        var x = map((i - firstPos), 0, waveform.length, 0, width * 3);
        var y = map(waveform[i], -1, 1, height, 0);
      }
      vertex(x, y);
    }
    endShape();
  }

}

function mouseClicked()
{
  paused = !paused;
}
