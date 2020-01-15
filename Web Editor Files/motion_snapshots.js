var video; 
var button; 
//var snapshots = [];
var x = 0; 
var y = 0; 
var canvas_x;
var canvas_y;
var snap_go = true; 
var bool_reset = false; 

function setup() { 
  canvas_x = windowWidth; 
  canvas_y = windowHeight/2 + 50; 
  createCanvas(canvas_x, canvas_y); 
  background(51); 
  video = createCapture(VIDEO); 
  video.size(320,240); 
  video.position(canvas_x/2-150,canvas_y); 
  
  
  
  start_button = createButton('Start Snapping!'); 
  start_button.mousePressed(takesnap); 
  start_button.position(0, 0); 
  stop_button = createButton("STOP"); 
  stop_button.mousePressed(stopsnap);
  stop_button.position(start_button.x + start_button.width, 0); 
  reset_button = createButton("Reset");
  reset_button.mousePressed(reset);
  reset_button.position(stop_button.x + stop_button.width,0); 
  width_slider = createSlider(0,windowWidth/2,80,10); 
  width_slider.position(0, start_button.y + start_button.height + 5); 
  height_slider = createSlider(0,windowHeight/4,60,10); 
  height_slider.position(0, start_button.y + start_button.height + 25);
  y = height_slider.y + 25; 
}

function takesnap() { 
  // snapshots.push(video.get());
  snap_go = true; 
  if (bool_reset == true){
    x = 0; 
    y = height_slider.y + 25; 
    bool_reset = false; 
  }
  setInterval(snapping,1000); 
}

function stopsnap(){
  snap_go = false; 
}

function reset(){
  clear(); 
  createCanvas(canvas_x, canvas_y); 
  background(51); 
  bool_reset = true;
}

function snapping(){ 
  if (snap_go == true){ 
    if (x <= canvas_x && y <= canvas_y){
      image(video, x, y, width_slider.value(), height_slider.value()); 
      x = x + width_slider.value();  
    }
    else{
      x = 0; 
      y = y + height_slider.value(); 
    }
  }
}

function draw() {
  noLoop();
  fill(255);
  text("WIDTH", width_slider.x +width_slider.width + 10, width_slider.y +15); 
  text("HEIGHT", height_slider.x +height_slider.width + 10, height_slider.y +15); 
}
