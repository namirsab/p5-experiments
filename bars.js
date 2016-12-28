var song;
var fft;
var canvas;
var barWidth;

function preload() {
    song = new p5.AudioIn();

}

function setup() {
    canvas = createCanvas(displayWidth - 100, displayHeight - 100, P2D);
    // Maptastic(canvas.id());
    print(canvas);
    fft = new p5.FFT();
    song.start();
    fft.setInput(song);


}


function draw() {
    var spectrum = fft.analyze();
    var backGroundEnergy = fft.getEnergy('lowMid');
    barWidth = width / 4;
    background(0);
    noStroke();
    var mainBassEnergy = renderEnergy('bass', 0, height/2, barWidth, (energy) => fill(255, energy, 0), height/2);
    var mainMidEnergy = renderEnergy('mid', barWidth, height/2, barWidth, (energy) => fill(0, 255, energy), height/2);
    var mainTrebleEnergy = renderEnergy('treble', 2*barWidth, height/2, barWidth, (energy) => fill(energy, energy, 255), height/2);
    var mainHighMidEnergy = renderEnergy('highMid', 3*barWidth, height/2, barWidth, (energy) => fill(255, energy, energy), height/2);
    var subBarWidth = barWidth / 3;
    // renderEnergy('bass', 0, height, subBarWidth, (energy) => fill(100, energy, 100));
    renderEnergy('mid', 0, height/2, subBarWidth, (energy) => fill(0, 255, energy), -height/2);
    renderEnergy('treble', subBarWidth, height/2, subBarWidth, (energy) => fill(energy, energy, 255), -height/2);
    renderEnergy('highMid', 2*subBarWidth, height/2, subBarWidth, (energy) => fill(255, energy, energy), -height/2);

    renderEnergy('bass', barWidth, height/2, subBarWidth, (energy) => fill(255, energy, 0), -height/2);
    renderEnergy('treble', barWidth + subBarWidth, height/2, subBarWidth, (energy) => fill(energy, energy, 255), -height/2);
    renderEnergy('highMid', barWidth + 2*subBarWidth, height/2, subBarWidth, (energy) => fill(255, energy, energy), -height/2);

    renderEnergy('bass', 2*barWidth, height/2, subBarWidth, (energy) => fill(255, energy, 0), -height/2);
    renderEnergy('mid', 2*barWidth + subBarWidth, height/2, subBarWidth, (energy) => fill(0, 255, energy), -height/2);
    renderEnergy('highMid', 2*barWidth + 2*subBarWidth, height/2, subBarWidth, (energy) => fill(255, energy, energy), -height/2);

    renderEnergy('bass', 3*barWidth, height/2, subBarWidth, (energy) => fill(255, energy, 0), -height/2);
    renderEnergy('mid', 3*barWidth + subBarWidth, height/2, subBarWidth, (energy) => fill(0, 255, energy), -height/2);
    renderEnergy('treble', 3*barWidth + 2*subBarWidth, height/2, subBarWidth, (energy) => fill(energy, energy, 255), -height/2);

    renderWaveForm();
}

function renderEnergy(from, x, y, renderWidth, fillFn, max = height) {
    var energy = fft.getEnergy(from);
    fillFn(energy);
    rect(x, y, renderWidth, map(-energy, 0, 255, 0, max));
    return energy;
}

function renderWaveForm() {
    waveform = fft.waveform();

    // Draw snapshot of the waveform
    beginShape();
    for (var i = 0; i< waveform.length; i++){
        noFill();
        stroke(map(waveform[i], -1, 1, 0, 255));
        strokeWeight(map(waveform[i], -1, 1, 0, 2));
        vertex(i*2, map(waveform[i], -1, 1, height, 0) );
    }
    endShape();
}
