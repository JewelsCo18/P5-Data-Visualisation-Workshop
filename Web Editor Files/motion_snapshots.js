var video; 
var button; 
//var snapshots = [];
var x = 0; 
var y = 0; 
var canvas_x;
var canvas_y;

function setup() { 
  canvas_x = windowWidth; 
  canvas_y = windowHeight/2; 
  createCanvas(canvas_x, canvas_y); 
  background(51); 
  video = createCapture(VIDEO); 
  video.size(320,240); 
  video.position(canvas_x/2-150,canvas_y); 
  button = createButton('Start Snapping!'); 
  button.mousePressed(takesnap); 
}

function takesnap() { 
  // snapshots.push(video.get()); 
  setInterval(snapping,500); 
}

function snapping(){ 
  var w = 80; 
  var h = 60; 
  if (x <= canvas_x && y <= canvas_y){
    image(video, x, y, 80, 60); 
    x = x + w;  
  }
  else{
    x = 0; 
    y = y + h; 
  }
}

function draw() {

}
