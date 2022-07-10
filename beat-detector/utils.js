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
