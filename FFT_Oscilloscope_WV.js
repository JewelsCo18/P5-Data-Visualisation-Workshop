var mic, fft, trigger;
var paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 2048);
  fft.setInput(mic);
  
}

function draw() {
  
  if (!paused)
  {
    background(80);

    var waveform = fft.waveform();  // analyze the waveform
    beginShape();
    strokeWeight(2);
    noFill();
    stroke(109,255,245);
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