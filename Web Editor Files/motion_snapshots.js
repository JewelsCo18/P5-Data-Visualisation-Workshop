var video; 
var button; 
//var snapshots = [];
var x = 0; 
var y = 0; 
var canvas_x = 650; 
var canvas_y = 240; 

function setup() { 
  createCanvas(canvas_x, canvas_y); 
  background(51); 
  video = createCapture(VIDEO); 
  video.size(320,240); 
  video.position(175,240); 
  button = createButton('snap'); 
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
