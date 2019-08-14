var data; 
var colours = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "black", "white"]; 
var count = 10; 
var angles = []; 
var cnv; 
var college_dict; 
var title; 
var list; 
var curr_num = 700; 
var num_list = "7hun_lst"; 
var curr_angle = null; 

function preload() {
  data = loadJSON("new_colleges.json");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0,0);
  noLoop(); 
  noStroke();

  var colleges = data.colleges;

  college_dict = { 
    7:0, 
    "7hun_lst": [],
    8: 0,
    "8hun_lst": [],
    9: 0,
    "9hun_lst": [],
    10: 0,
    "10hun_lst": [],
    11: 0,
    "11hun_lst": [],
    12: 0,
    "12hun_lst": [],
    13: 0,
    "13hun_lst": [],
    14: 0, 
    "14hun_lst": [],
    15: 0,  
    "15hun_lst": [], 
    16: 0,  
    "16hun_lst": [], 
    "overall": 0, 
  }

  for (var i = 0; i < colleges.length; i++) {
    if (colleges[i].averageSAT != null) {
      college_dict["overall"] += 1; 
      if (700 < colleges[i].averageSAT && colleges[i].averageSAT < 800) {
          college_dict[7]+= 1; 
          college_dict["7hun_lst"].push(colleges[i].name); 
      }
      else if (800 < colleges[i].averageSAT && colleges[i].averageSAT <= 900) {
          college_dict[8]+= 1; 
          college_dict["8hun_lst"].push(colleges[i].name); 
      }
      else if (900 < colleges[i].averageSAT && colleges[i].averageSAT <= 1000) {
          college_dict[9]+= 1; 
          college_dict["9hun_lst"].push(colleges[i].name); 
      }
      else if (1000 < colleges[i].averageSAT && colleges[i].averageSAT <= 1100) {
          college_dict[10]+= 1; 
          college_dict["10hun_lst"].push(colleges[i].name); 
      }
      else if (1100 < colleges[i].averageSAT && colleges[i].averageSAT <= 1200) {
          college_dict[11]+= 1; 
          college_dict["11hun_lst"].push(colleges[i].name); 
      }
      else if (1200 < colleges[i].averageSAT && colleges[i].averageSAT <= 1300) {
          college_dict[12]+= 1; 
          college_dict["12hun_lst"].push(colleges[i].name); 
      }
      else if (1300 < colleges[i].averageSAT && colleges[i].averageSAT <= 1400) {
          college_dict[13]+= 1; 
          college_dict["13hun_lst"].push(colleges[i].name); 
      }
      else if (1400 < colleges[i].averageSAT && colleges[i].averageSAT <= 1500) {
          college_dict[14]+= 1; 
          college_dict["14hun_lst"].push(colleges[i].name); 
      }
      else if (1500 < colleges[i].averageSAT && colleges[i].averageSAT <= 1600) {
          college_dict[15]+= 1; 
          college_dict["15hun_lst"].push(colleges[i].name); 
      }
      else{
        college_dict[16] += 1; 
        college_dict["16hun_lst"].push(colleges[i].name); 
      }
    }

  }

  // print("overall:", college_dict["overall"]);

  for (var j = 0; j <= 9; j++) {
    num = (college_dict[j+7]/college_dict["overall"])*360; 
    if (num != 0) {
      angles.push(num); 
    }
  }
  print(angles); 
  // print(college_dict); 

  selection = createSelect();
  selection.position((windowWidth/2.5) - 70, 35); 
  for (var i = 0; i < angles.length; i++) { 
    selection.option(i+7+ "00"); 
  }
  selection.changed(collegeList);

  curr_angle = (angles[0]/360)*100;  
}

function draw() {
  background(100);
  pieChart(300, angles);
  textSize(14); 

  for (var place= 0; place <angles.length; place++) {
    rect(10, count, 20, 20); 
    text(place+7 + "00", 35, count+15); 
    fill(colours[place]);
    count = count + 20;
  }

  fill(0,0,0); 
  textSize(28); 
  title = text(curr_angle + "% of colleges scored in the " + curr_num + "s" , windowWidth/2.5,50); 
  var newline = 0; 
  var width = windowWidth/2.5
  for (var i = 0; i< college_dict[num_list].length; i++) {
    textSize(11); 
    text(college_dict[num_list][i], width, 100+newline); 
    newline += 11; 
    if (newline >= windowHeight-100) { 
      //resizeCanvas(windowWidth+300, windowHeight); 
      newline = 0; 
      width = width + 300;
    } 
  }
}

function pieChart(diameter, data) {
  let lastAngle = 0;
  for (let i = 0; i < data.length; i++) {
    fill(colours[i]); 
    arc(
      width / 4.8,
      height / 2,
      diameter*1.75,
      diameter*1.75,
      lastAngle,
      lastAngle + radians(angles[i])
    );
    lastAngle += radians(angles[i]);
  }
}

function collegeList() { 
  var score = selection.value(); 
  curr_num = score; 
  check = (score-700) / 100; 
  curr_angle = (angles[check]/360)*100;
  num_list = (score/100) + "hun_lst"; 
  print(num_list); 
  count = 10;
  redraw();
}
















