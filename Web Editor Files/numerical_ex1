var data; 
var colours = []; 
var count = 20; 
var angles = []; 
var cnv; 
var title; 
var snacks; 
var curr_snack = "CHIPS"; 

//DATA//

function preload() {
  data = loadJSON("snacks.json");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0,0);
  noLoop(); 
  noStroke();

  snacks = data.snacks;

  //calculating snack percentages 
  for (var j = 0; j <= snacks.length-1; j++) {
    new_angle = (snacks[j].percentage/100)*360; 
    angles.push(new_angle); 
  }

  //creating a drop down with snack choices in JSON
  selection = createSelect();
  selection.position((windowWidth/2+100) , 35); 
  for (var i = 0; i < angles.length; i++) { 
    selection.option(snacks[i].type); 
  }
  selection.changed(changeList);

}

//VISUAL//

function draw() {

  //colour options
  colours = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "black", "white"]; 
  //background colour
  background(80);
  pieChart(300, angles);
  textSize(14); 

  //creating index labels
  for (var i= 0; i <angles.length; i++) {
    rect(20, count, 40, 40); 
    textSize(12); 
    text(snacks[i].type, 70, count+30); 
    fill(colours[i]);
    count = count + 40;
  }

  fill(0,0,0); 
  textSize(28); 
  text("Most popular ",windowWidth/2+100,90); 
  title = text(curr_snack + " brands", windowWidth/2+ 100,120); 
  var newline = 0; // variable for positioning snack list 
  var width = windowWidth/2 + 100
  for (var i = 0; i< snacks.length; i++) {
    if (snacks[i].type == curr_snack) {
      for (var j = 0; j < snacks[i].brands.length; j++) {
        text(snacks[i].brands[j], width, 160+newline); 
        newline += 30; 
        if (newline >= windowHeight-100) { //just in case snacks exceed windowHeight
          newline = 0; 
          width = width + 300;
        } 
      }
    }
  }
}

function pieChart(diameter, data) {
  let lastAngle = 0;
  for (let i = 0; i < data.length; i++) {
    fill(colours[i]); 
    arc(
      width / 2.6,//width of pie
      height / 1.5, //height of pie
      diameter*1.2, //diameter of pie
      diameter*1.2,
      lastAngle,
      lastAngle + radians(angles[i])
    );
    lastAngle += radians(angles[i]);
  }
}

function changeList() { 
  var new_snack = selection.value(); 
  curr_snack = new_snack; 
  count = 20;
  redraw();
}



