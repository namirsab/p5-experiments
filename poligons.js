var song;
var fft;
var canvas;
var barWidth;
var maxWidth;
var maxHeight;
var peakFountain;
var peakFountain2;
var peakDetect;

function preload() {
    song = new p5.AudioIn();
    maxWidth = displayWidth - 100;
    maxHeight = displayHeight  - 110;

}

function randomPolygon(fountain, particle) {
    var x = particle.location.x;
    var y = particle.location.y;
    var mappedMouseX = map(mouseX, 0, maxWidth, 0, 255);
    fill(color(random(255), random(mappedMouseX), random(255)));
    beginShape(TRIANGLES);
    var size = 10 * particle.partSize;
    vertex(x + random(size), y + random(size));
    vertex(x + random(size), y + random(size));
    vertex(x + random(size), y + random(size));
    vertex(x + random(size), y + random(size));
    vertex(x + random(size), y + random(size));
    vertex(x + random(size), y + random(size));
    endShape(CLOSE);
}

function setup() {
    canvas = createCanvas(maxWidth, maxHeight, P2D);
    // Maptastic(canvas.id());
    print(canvas);
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
    song.start();
    fft.setInput(song);

    Fountain_display('polygon', randomPolygon);

    var t =
    {
        name: "test",
        colors: ["yellow"],
        gravity: 0.00,
        lifetime: 900,
        angle: [0,360],
        size: [4, 4],
        rate: [0, 100],
        speed: 6,
        speedx: 0,
        x: 0.5,
        y: 0.5,
        rotation: 4,
        shape: 'polygon'
    };

    peakFountain = new Fountain(null, t);

    

    
}

function draw() {
    var spectrum = fft.analyze();
    peakDetect.update(fft);
    var bassEnergy = fft.getEnergy('bass');
    var lowMid = fft.getEnergy('lowMid');
    var treble = fft.getEnergy('treble');
    background(0);
    //renderBackground(maxWidth, maxHeight, treble);
    noStroke();
    peakFountain.Draw();
    if (peakDetect.isDetected) {
        console.log('peak')
        peakFountain.CreateN();
    }
    peakFountain.Step();

    
}

function renderBackground(maxWidth, maxHeight, bassEnergy) {
    noStroke();
    fill('black');
    beginShape();
    vertex(0, 0);
    vertex(maxWidth/2, maxHeight);
    vertex(maxWidth, 0);
    endShape(CLOSE);


    fill(color(bassEnergy, 0, 0));
    beginShape();
    vertex(0, 0);
    vertex(maxWidth/2, maxHeight);
    vertex(0, maxHeight);
    endShape(CLOSE);

    fill(color(bassEnergy, 0, 0));
    beginShape();
    vertex(maxWidth, 0);
    vertex(maxWidth/2, maxHeight);
    vertex(maxWidth, maxHeight);
    endShape(CLOSE);
    
}
