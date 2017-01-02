let song;
let fft;
const NUM_OF_TILES = 32;
const MAX = NUM_OF_TILES - 1;
const HALF = (NUM_OF_TILES / 2) - 1;
let graphics;


function preload() {
    song = new p5.AudioIn();
}

function setup() {
    canvas = createCanvas(600, 600, P2D);

    fft = new p5.FFT();
    song.start();
    fft.setInput(song);
    Tiles.initialize({ NUM_OF_TILES, TILE_WIDTH: width / NUM_OF_TILES });
}



function draw() {
    
    const spectrum = fft.analyze();
    const bassEnergy = fft.getEnergy('bass');
    const lowMidEnergy = fft.getEnergy('lowMid');
    const midEnergy = fft.getEnergy('mid');
    const highMidEnergy = fft.getEnergy('highMid');
    const trebleEnergy = fft.getEnergy('treble');
    background(0);
    
    // console.time('calculate');
    Tiles.addGenerator({ center: { i: HALF, j: HALF }, energy: bassEnergy, mainColor: 'r' });
    Tiles.addGenerator({ center: { i: MAX, j: HALF }, energy: lowMidEnergy, mainColor: 'g'});
    Tiles.addGenerator({ center: { i: 0, j: HALF }, energy: lowMidEnergy, mainColor: 'g' });
    Tiles.addGenerator({ center: { i: HALF, j: MAX }, energy: midEnergy, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: 0, j: MAX }, energy: trebleEnergy, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: MAX, j: MAX }, energy: trebleEnergy, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: 0, j: 0 }, energy: trebleEnergy, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: MAX, j: 0 }, energy: trebleEnergy, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: HALF, j: 0 }, energy: midEnergy, mainColor: 'b' });
    // console.timeEnd('calculate');
    // console.time('draw');
    Tiles.draw();
    // console.timeEnd('draw');
    Tiles.clear();    
}

