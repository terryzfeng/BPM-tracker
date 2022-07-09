const avgWindow = 20.0;
const threshold = 0.4;

let song;
let fft;
let beat;
let lastPeak;

function preload() {
  song = loadSound("./90bpm.wav");
}

function setup() {
  createCanvas(400, 400);
  fft = new p5.FFT();
  song.loop();
  beat = millis();
}

function mousePressed() {
    if (song.isPlaying()) {
        song.stop();
    } else {
        song.play();
    }
}

function draw() {
  // Pulse white on the beat, then fade out with an inverse cube curve
  background(map(1 / pow((millis() - beat) / 1000 + 1, 3), 1, 0, 255, 100));
  drawSpectrumGraph(0, 0, width, height);
}

let runningAvg = 0;
// Graphing code adapted from https://jankozeluh.g6.cz/index.html by Jan Koželuh
function drawSpectrumGraph(left, top, w, h) {
  let spectrum = fft.analyze();

  stroke('limegreen');
  fill('darkgreen');
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

    runningAvg += spectrum[i] / avgWindow;
    if (i >= avgWindow) {
      runningAvg -= spectrum[i] / avgWindow;
    }
    if (runningAvg > peak) {
      peak = runningAvg;
    }
  }

  // any time there is a sudden increase in peak energy, call that a beat
  if (peak > lastPeak * (1 + threshold)) {
    print(`tick ${++i}`);
    beat = millis();
  }
  lastPeak = peak;

  vertex(left + w, top + h);
  endShape(CLOSE);
  // this is the range of frequencies covered by the FFT
  let nyquist = 22050;

  // get the centroid (value in hz)
  let centroid = fft.getCentroid();

  // the mean_freq_index calculation is for the display.
  // centroid frequency / hz per bucket
  let mean_freq_index = centroid / (nyquist / spectrum.length);
  stroke('red');
  // convert index to x value using a logarithmic x axis
  let cx = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);
  line(cx, 0, cx, h);
}
