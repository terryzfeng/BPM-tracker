const avgWindow = 20;
const threshold = 0.4;

const freq1 = 20.0;
const freq2 = 150.0;
const framesPerPeak = 20;
const peakThreshold = 0.05;

let ellipseWidth = 10;

let song;
let fft;
let peakDetect;
let lastPeak;
let result = 0;


function setup() {
  print("setup")
  var myCanvas = createCanvas(windowWidth * 0.40, windowHeight * 0.30);
  myCanvas.parent('mainsectcanvas');
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(freq1, freq2, threshold, framesPerPeak);
  lastPeak = millis();
}

function moveButton() {
  if (!urlLoaded) {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
}

function screenResize(){
  
    if(windowWidth < 1270) {
        resizeCanvas(windowWidth * 0.50, windowHeight * 0.50);
    } else{
        resizeCanvas(windowWidth * 0.40, windowHeight * 0.30);
    }

}

document.querySelector('.play')
  .addEventListener('click',function(){
  moveButton();
  });

function draw() {
  screenResize();
  if (urlLoaded) {
    document.querySelector('.play').style.background = 'rgb(0,204,153)';
    print(url);
    song = loadSound(url);
    urlLoaded = false;
  }
  //button.mouseClicked(moveButton);
  // Pulse white on the beat, then fade out with an inverse cube curve
  background(128, 128, 128);
  drawSpectrumGraph(0, 0, width, height);
  beatAnimation(0, 0, width, height);
  stroke(255,0,0);
  strokeWeight(1);
  fill(253);
  rect(0,height-30.5,200,30)
  textSize(18);
  fill(0);
  noStroke();
  text(`CURRENT: ${Math.round(result)} BPM`, 10, height-10);
}

const bufferMinLength = 8;
const bufferMaxLength = 15;
let peakBuffer = [];
function calculateBPM() {
  let peak = millis();
  peakBuffer.push(peak);

  if (peakBuffer.length >= bufferMinLength) {
    let BPMs = [];

    // BPM ranking algorithm
    for (let i = 0; i < peakBuffer.length - 1; i++) {
      BPMs.push(millisToBPM(peakBuffer[i + 1] - peakBuffer[i]));
    }
    let rankBPM = BPMs.reduce((bpm, index) => {
      bpm[index] = (bpm[index] || 0) + 1;
      return bpm;
    }, {});
    rankBPM = Object.entries(rankBPM);
    // Sort ranks
    let ranked = rankBPM.sort((a,b) => b[1] - a[1]);
    let bpm = ranked.slice(0,2);
    result = 0;
    if (bpm[0][1] != bpm[1][1]) {
      result = parseInt(bpm[0][0]);
    } else {
      result = Math.round((parseInt(bpm[0][0]) + parseInt(bpm[1][0])) / 2.0);
    }

    print(`RUNNING BPM: ${result}`);

    // Start deleting saved peaks
    if (peakBuffer.length >= bufferMaxLength) {
      peakBuffer.shift();
    }
  } else {
    print(`INSTANT BPM: ${millisToBPM(peak - lastPeak)}`);
  }

  lastPeak = peak;
}

function beatAnimation(left, top, w, h) {
  peakDetect.update(fft);
  if (peakDetect.isDetected) {
    ellipseWidth = 50;
    calculateBPM();
  } else {
    ellipseWidth *= 0.95;
  }
  beginShape();
  fill(color(255));
  ellipse(w / 2, h / 2, ellipseWidth, ellipseWidth);
  endShape();
}

// Graphing code adapted from https://jankozeluh.g6.cz/index.html by Jan Koželuh
function drawSpectrumGraph(left, top, w, h) {
  let spectrum = fft.analyze();

  stroke("white");
  fill("lightblue");
  strokeWeight(1);

  beginShape();
  vertex(left, top + h);

  let peak = 0;
  // compute a running average of values to avoid very
  // localized energy from triggering a beat.
  for (let i = 0; i < spectrum.length; i++) {
    vertex(
      //left + map(i, 0, spectrum.length, 0, w),
      // Distribute the spectrum values on a logarithmic scale
      // We do this because as you go higher in the spectrum
      // the same perceptible difference in tone requires a
      // much larger chang in frequency.
      left + map(log(i), 0, log(spectrum.length), 0, w),
      // Spectrum values range from 0 to 255
      top + map(spectrum[i], 0, 255, h, 0)
    );
  }

  vertex(left + w, top + h);
  endShape(CLOSE);

  // this is the range of frequencies covered by the FFT
  let nyquist = 22050;
  // get the centroid (value in hz)
  let centroid = fft.getCentroid();
  // the mean_freq_index calculation is for the display.
  // centroid frequency / hz per bucket
  let mean_freq_index = centroid / (nyquist / spectrum.length);
  stroke("red");
  // convert index to x value using a logarithmic x axis
  let cx = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);
  line(cx, 0, cx, h);
}







// function calculateBPM() {
//   let peak = millis();
//   peakBuffer.push(peak);
//   average = 0;
//   if (peakBuffer.length >= bufferLength) {
//     for (let i = 0; i < peakBuffer.length - 1; i++) {
//       average += millisToBPM(peakBuffer[i + 1] - peakBuffer[i]) / bufferLength;
//     }
//     print(`AVERAGE BPM: ${average}`);
//     peakBuffer.shift();
//   } else {
//     print(`IMMEDIATE BPM: ${millisToBPM(peak - lastPeak)}`);
//     //print("tick");
//   }

//   lastPeak = peak;
// }

// function beatAnimation(left, top, w, h) {
//   peakDetect.update(fft)
//   if (peakDetect.isDetected) {
//     ellipseWidth = 50;
//     calculateBPM();
//   } else {
//     ellipseWidth *= .95;
//   }
//   beginShape();
//   fill(color(255));
//   ellipse(w / 2, h / 2, ellipseWidth, ellipseWidth);
//   endShape();
// }

// // Graphing code adapted from https://jankozeluh.g6.cz/index.html by Jan Koželuh
// function drawSpectrumGraph(left, top, w, h) {
//   let spectrum = fft.analyze();


//   stroke('white');
//   fill('lightblue');
//   strokeWeight(1);

//   beginShape();
//   vertex(left, top + h);

//   let peak = 0;
//   // compute a running average of values to avoid very
//   // localized energy from triggering a beat.
//   for (let i = 0; i < spectrum.length; i++) {
//     vertex(
//       //left + map(i, 0, spectrum.length, 0, w),
//       // Distribute the spectrum values on a logarithmic scale
//       // We do this because as you go higher in the spectrum
//       // the same perceptible difference in tone requires a 
//       // much larger chang in frequency.
//       left + map(log(i), 0, log(spectrum.length), 0, w),
//       // Spectrum values range from 0 to 255
//       top + map(spectrum[i], 0, 255, h, 0)
//     );
//   }

//   vertex(left + w, top + h);
//   endShape(CLOSE);

//   // this is the range of frequencies covered by the FFT
//   let nyquist = 22050;
//   // get the centroid (value in hz)
//   let centroid = fft.getCentroid();
//   // the mean_freq_index calculation is for the display.
//   // centroid frequency / hz per bucket
//   let mean_freq_index = centroid / (nyquist / spectrum.length);
//   stroke('red');
//   // convert index to x value using a logarithmic x axis
//   let cx = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);
//   line(cx, 0, cx, h);
// }
