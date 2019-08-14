var data; 
var count = 10; 
var angles = []; 
var cnv; 
var college_dict; 
var clickboxes = []; 
var check_var = 0; 
var title; 
var textlist; 

function preload() {
  data = loadJSON("new_colleges.json");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0,0);
  background(100);
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

  //print(angles); 

  curr_angle = (angles[0]/360)*100;  
}

function draw() { 
  var xpos = 160; 
  var ypos = 160; 
  var curr_size = (windowWidth/angles.length)*1.2; 

  for (var j = 0; j <= (windowWidth/angles.length); j++ ) {
      var curr_num  = ((angles[j]/360)*50)+1;
      drawTarget(xpos, ypos, curr_size, curr_num);

      var top_x = abs(xpos-(windowWidth/angles.length)/2); 
      var top_y = abs(ypos-(windowWidth/angles.length)/2); 
      var bottom_x = abs(xpos+(windowWidth/angles.length)/2); 
      var bottom_y = abs(ypos+(windowWidth/angles.length)/2); 

      clickboxes.push([top_x, top_y, bottom_x, bottom_y]); 

      textSize(20); 
      text(j+7 + "00s", xpos-25, ypos-100);

      var curr_angle = (angles[j]/360)*100
      curr_angle = round(curr_angle); 

      xpos += windowWidth/angles.length; 
      if ((j-2)%3==0) { 
        ypos += 230; 
        xpos = 160;   
      }
      else {
        xpos += 70;
      }

      if (j > 7) { 
        break;
      }
    }

  print(clickboxes); 
}

function drawTarget(xloc, yloc, size, num) {
  const grayvalues = 255 / num;
  const steps = size / num;
  for (let i = 0; i < num; i++) {
    fill(i * grayvalues);
    ellipse(xloc, yloc, size - i * steps, size - i * steps);
  }
}

function check(xclick, yclick){
  for (check_var = 0; check_var<= clickboxes.length-1; check_var++) {
    if (clickboxes[check_var][0]<= xclick && xclick <= clickboxes[check_var][2]) { 
      if (clickboxes[check_var][1] <= yclick && yclick <= clickboxes[check_var][3]) { 
        return true; 
      } 
    }
  }
}

function draw_text(num) {
  background(100); 
  textSize(28); 
  var angle = angles[check_var]/360*100
  angle = round(angle); 
  title = text(angle+ "% of colleges scored in the " + (check_var+7) + "00s" , (windowWidth/2.5)+200,50); 
  var newline = 0; 
  var width = (windowWidth/2.5)+230
  for (var i = 0; i< college_dict[num].length; i++) {
    textSize(18); 
    textlist = text(college_dict[num][i], width, 100+newline); 
    newline += 20; 
  }

}

function mousePressed() { 
  var mouse_x = mouseX; 
  var mouse_y = mouseY; 

  print(mouse_x, mouse_y); 

  if (check(mouse_x, mouse_y) == true) {
    print("yes");
    num_list = check_var+7+"hun_lst"
    clear(); 
    draw_text(num_list);
    redraw(); 
  }
  else{
    print("no"); 
  }
}




















