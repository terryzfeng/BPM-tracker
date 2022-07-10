// BeatNet Server
const serverURL = "http://127.0.0.1:9099/bpm";
const testURL = "http://127.0.0.1:9099/test";

function millisToBPM(millis) {
  let bpm = 60000.0 / millis;

  // Keep BPM guess within 60bpm to 160bpm
  if (bpm < 60) {
    bpm *= 2;
  } else if (bpm > 160) {
    bpm /= 2;
  }

  return Math.round(bpm);
}

let response;
function blobUpload() {
  if (song != null && song.isLoaded()) {
    print("Loaded: 100%, Uploading...");
    let soundBlob = song.getBlob();
    let formdata = new FormData();
    formdata.append("soundBlob", soundBlob, "audio.wav");
    // Create POST Request to
    let httpsRequestOptions = {
      method: "POST",
      datatype: "json",
      data: formdata,
      headers: new Headers({
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      }),
      observe: "response",
      mode: "no-cors",
    };
    // Upload
    httpDo(serverURL, httpsRequestOptions, (response) => {
      if (response.status == 200) {
        print("ok");
      }
    });

    //httpDo( "https://dog.ceo/api/breeds/image/random", "GET", function (response) { print(response); });
    //httpDo( "https://randomuser.me/api/", { method: "GET", datatype: "json" }, function (response) { print(response.status); }, (response) => { print("fail"); });
  }
}

function error() {
  print("ERROR - BAD UPLOAD");
}

function loading(num) {
  print("LOADING: " + Math.round(num) + "%");
}
