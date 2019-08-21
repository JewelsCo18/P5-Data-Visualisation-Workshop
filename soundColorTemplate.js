//Sound Color Template
//Written for: ExCITe Center Workshop
var video, cnv;
let mic, fft;
let i = 0, volPress = false, energyPress = false;
var energy_bool = false;
/////******Here You Can Change The Max Tint For Each Of The Energy Levels******/////

var red_tint = 255;//Max of 255
var green_tint = 255;//Max of 255
var blue_tint = 255;//Max of 255

/////**********//////

function setup() {
    userStartAudio();
    cnv = createCanvas(windowWidth,windowHeight);
    noStroke();
    video = createCapture(VIDEO);
    video.size(0, 0, windowWidth/2, windowHeight/2);
    //video.hide()
    mic = new p5.AudioIn();
    fft = new p5.FFT(0.8, 1024);
    fft.setInput(mic);
/////******Here You Can Change Names and Positions of Our Two Buttons******/////

    volButton = createButton("Volume Based");
    volButton.position(100, 100);
    energyButton = createButton("Energy Based");
    energyButton.position(200, 100);

/////************/////
    volButton.mousePressed(micVol)
    energyButton.mousePressed(energyType)
    mic.start();
}
function draw() {
/////******Here You Can Change The Color of the Background******/////

    background(0)//background(R,G,B) each with Max 255

/////************/////
    image(video, 400, 200, windowWidth/1.55, windowHeight/1.55);
    video.loadPixels();
    if (volPress == true) {
        let vol = mic.getLevel();
        adjVol = (vol*255)
        console.log(vol)
/////******Here You Can Change Which Colors are affected by the mic Volume******/////

        tint(adjVol,0,0);//adjVol is the Volume level that corresponds to a color value

/////************/////
    }
    if (energyPress == true) {
        fft.analyze();
/////******Here You Can Change which tint corresponds to a specific range of frequency******/////

        if (fft.getEnergy("lowMid") > 130){

            red_tint = 255 * (155/fft.getEnergy("lowMid"))//change red_tint, to green_tint or blue_tint
        }
        else if (fft.getEnergy("highMid") > 20){
            green_tint = 255 * (20/fft.getEnergy("highMid"))//change green_tint, to red_tint or blue_tint
        }
        else if (fft.getEnergy("mid") > 38){
            blue_tint = 255 * (45/fft.getEnergy("mid"))//change blue_tint, to green_tint or red_tint
        }

/////************/////
//Make sure that if you don't have one of the colors above, you uncomment the corresponding color below//
        // red_tint = 0
        // green_tint = 0
        // blue_tint = 0
        print(red_tint, green_tint, blue_tint);
        tint(red_tint, green_tint,blue_tint);
        
        
    }
    video.updatePixels();
}
function micVol() {
    volPress = true;
    energyPress = false;
}
function energyType() {
    energy_bool = !energy_bool
    if (energy_bool == true){
        volPress = false;
        energyPress = true;
    }
    else{
        energyPress= false;
    }
    
}