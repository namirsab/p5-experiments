let song;
let fft;
const NUM_OF_TILES = 32;
const MAX = NUM_OF_TILES - 1;
const HALF = (NUM_OF_TILES / 2) - 1;
let graphics;
var radioSlider;


function preload() {
    song = new p5.AudioIn();
}

function setup() {
    canvas = createCanvas(600, 600, P2D);
    canvas.mousePressed(startDrag);
    canvas.mouseMoved(drag);
    canvas.mouseReleased(stopDrag);

    radioSlider = createSlider(0, NUM_OF_TILES, NUM_OF_TILES/2, 1);

    fft = new p5.FFT();
    song.start();
    fft.setInput(song);
    Tiles.initialize({ NUM_OF_TILES, TILE_WIDTH: width / NUM_OF_TILES });

    Tiles.addGenerator({
        center: { i: HALF, j: HALF },
        energy: 0,
        mainColor: 'r',
        radio: 30,
    });
    Tiles.addGenerator({ center: { i: MAX, j: HALF }, energy: 0, mainColor: 'g'});
    Tiles.addGenerator({ center: { i: 0, j: HALF }, energy: 0, mainColor: 'g' });
    Tiles.addGenerator({ center: { i: HALF, j: MAX }, energy: 0, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: 0, j: MAX }, energy: 0, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: MAX, j: MAX }, energy: 0, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: 0, j: 0 }, energy: 0, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: MAX, j: 0 }, energy: 0, mainColor: 'b' });
    Tiles.addGenerator({ center: { i: HALF, j: 0 }, energy: 0, mainColor: 'b' });
}

let draggedGeneratorId = null;

function draw() {

    const spectrum = fft.analyze();
    const bassEnergy = fft.getEnergy('bass');
    const lowMidEnergy = fft.getEnergy('lowMid');
    const midEnergy = fft.getEnergy('mid');
    const highMidEnergy = fft.getEnergy('highMid');
    const trebleEnergy = fft.getEnergy('treble');

    background(0);

    // console.time('calculate');
    const radio = radioSlider.value();

    Tiles.updateGenerator(0, { energy: bassEnergy, radio });
    Tiles.updateGenerator(1, { energy: lowMidEnergy });
    Tiles.updateGenerator(2, { energy: lowMidEnergy });
    Tiles.updateGenerator(3, { energy: midEnergy });
    Tiles.updateGenerator(4, { energy: trebleEnergy });
    Tiles.updateGenerator(5, { energy: trebleEnergy });
    Tiles.updateGenerator(6, { energy: trebleEnergy });
    Tiles.updateGenerator(7, { energy: trebleEnergy });
    Tiles.updateGenerator(8, { energy: midEnergy });

    // console.timeEnd('calculate');
    // console.time('draw');
    Tiles.draw();
    // console.timeEnd('draw');
    Tiles.clear();
    console.log(draggedGeneratorId);

}



function startDrag() {
    const i = Math.trunc(map(mouseX, 0, width, 0, NUM_OF_TILES));
    const j = Math.trunc(map(mouseY, 0, height, 0, NUM_OF_TILES));
    const generatorId = Tiles.getGeneratorId(i, j);

    if (generatorId >= 0) {
        draggedGeneratorId = generatorId;
    }
}

function drag() {
    if (draggedGeneratorId >= 0) {
        const i = Math.trunc(map(mouseX, 0, width, 0, NUM_OF_TILES));
        const j = Math.trunc(map(mouseY, 0, height, 0, NUM_OF_TILES));

        Tiles.updateGenerator(draggedGeneratorId, {
            center: { i, j }
        });
    }
}

function stopDrag() {
    draggedGeneratorId = null;
}

function keyPressed() {
    if (draggedGeneratorId >= 0) {
        let mainColor;

        switch(keyCode) {
            case 82:
                mainColor = 'r';
                break;
            case 71:
                mainColor = 'g';
                break;
            case 66:
                mainColor = 'b';
                break;
        }

        if (mainColor) {
            Tiles.updateGenerator(draggedGeneratorId, { mainColor });
        }

    }
}

function mousePressed() {
    userStartAudio();
}
