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
}



function draw() {
    
    const spectrum = fft.analyze();
    const bassEnergy = fft.getEnergy('bass');
    const lowMidEnergy = fft.getEnergy('lowMid');
    const midEnergy = fft.getEnergy('mid');
    const highMidEnergy = fft.getEnergy('highMid');
    const trebleEnergy = fft.getEnergy('treble');
    const tileWidth = width / NUM_OF_TILES;
    background(0);
    
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: HALF, j: HALF }, tileWidth, energy: bassEnergy, mainColor: 'r' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: MAX, j: HALF }, tileWidth, energy: lowMidEnergy, mainColor: 'g'});
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: 0, j: HALF }, tileWidth, energy: lowMidEnergy, mainColor: 'g' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: HALF, j: MAX }, tileWidth, energy: midEnergy, mainColor: 'b' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: 0, j: MAX }, tileWidth, energy: trebleEnergy, mainColor: 'b' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: MAX, j: MAX }, tileWidth, energy: trebleEnergy, mainColor: 'b' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: 0, j: 0 }, tileWidth, energy: trebleEnergy, mainColor: 'b' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: MAX, j: 0 }, tileWidth, energy: trebleEnergy, mainColor: 'b' });
    renderTiles({ numOfTiles: NUM_OF_TILES, center: { i: HALF, j: 0 }, tileWidth, energy: midEnergy, mainColor: 'b' });
    drawTiles();
    tileMatrix = [];
    
}

