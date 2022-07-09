import {getPeaks, getIntervals} from './bpm-processing.js';

// AUDIO NODE SETUP
const audioContext = new AudioContext();
const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);

// PLAYBACK CONTROL
const playButton = document.querySelector("button");
playButton.addEventListener(
  "click",
  function () {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === "false") {
      audioElement.play();
      this.dataset.playing = "true";
    } else if (this.dataset.playing === "true") {
      audioElement.pause();
      this.dataset.playing = "false";
    }

    console.log(this.dataset.playing);
  },
  false
);

// When song ends
audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false
);

// REAL TIME ANALYZER
let OfflineContext =
  window.OfflineAudioContext || window.webkitOfflineAudioContext;
let offlineContext = new OfflineContext(2, 30 * 44100, 44100);

offlineContext.decodeAudioData(request)


track.connect(offlineContext);
offlineContext.connect(audioContext.destination);
track.connect(audioContext.destination);
