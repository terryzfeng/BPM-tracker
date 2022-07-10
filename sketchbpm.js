var beats = 5;
var bpm =  80;
var counter;

function setup() {
  //createCanvas(310, 90);
  createCanvas(600,600);
}

function draw() {
  background(255);
  figures();
  
  setBPM(bpm,0);
  var durVal = round((60 / bpm) * 1000);
  counter = (Math.trunc(millis() / durVal)%beats)+1;
}

function figures(){
  rectMode(CORNER);
  var margin = width*0.05;
  for (var i= 1; i <= beats;i++){ 
  fill(255);
  rect(((width/beats)*i)-(width/beats)+margin/2,(height/2)-(height/beats)/2+margin/2,(width/beats)-margin,(height/beats)-margin,width/beats);
  //rect(((width/beats)*i)-(width/beats)+margin/2,0,(width/beats)-margin,height);
  }
  
  if(counter==1){fill(255,0,0)}else{fill(255,255,0)}
  strokeWeight(0);
  rect(((width/beats)*counter)-(width/beats)+margin/2,(height/2)-(height/beats)/2+margin/2,(width/beats)-margin,(height/beats)-margin,width/beats);
 
    fill(0)
   .strokeWeight(0.3)
   .textSize(40);
  textFont('Helvetica');
  //text(bpm.toString()+" bpm",width*0.43,height*0.1);
  text(counter,width*0.47,height*0.15);  
}


