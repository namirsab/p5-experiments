var song;
var fft;
var canvas;
var barWidth;
var maxWidth;
var maxHeight;
var yellowFountain;
var redFountain;
var peakFountain;
var peakFountain2;
var peakDetect;

function preload() {
    song = new p5.AudioIn();
    maxWidth = displayWidth - 100;
    maxHeight = displayHeight  - 110;

}

function setup() {
    canvas = createCanvas(maxWidth, maxHeight, P2D);
    // Maptastic(canvas.id());
    print(canvas);
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect(20, 20000, 0.35, 60);
    song.start();
    fft.setInput(song);

    var t =
    {
        name: "test",
        colors: ["yellow"],
        gravity: 0.00,
        lifetime: 900,
        angle: [0,360],
        size: [2,8],
        rate: [1, 1],
        speed: 2,
        speedx: 100,
        x: 0.5,
        y: 0.5,
        rotation: 0,
    };
    yellowFountain = new Fountain(null, t);

    redFountain = new Fountain(null, Object.assign({}, t, {
        colors: ['red'],
        x: 1,
        y: 0.5
    }));

    peakFountain = new Fountain(null, Object.assign({}, t, {
        colors: [color(0,255,0, 255)],
        x: 0.5,
        y: 0.5,
        rate: [1,300],
        angle: [0, 360],
        size: [10, 15],
        speedx: 0.2,
        speed: 3,
        file: './assets/swirl-colorful-rainbow-colors-arts-colors-circle.png',
        shape: 'image',
    }));

    peakFountain2 = new Fountain(null, Object.assign({}, t, {
        colors: ['blue'],
        x: 0.5,
        y: 0.5,
        rate: [1,300],
        angle: [0, 360],
        size: [10, 15],
        speedx: 0.2,
        speed: 3,
    }));

    
}

var peakNumber = 0;
function draw() {
    var spectrum = fft.analyze();
    peakDetect.update(fft);
    var bassEnergy = fft.getEnergy('bass');
    var lowMid = fft.getEnergy('lowMid');
    background(0);
    noStroke();
    renderCircle(color(255,0,0), lowMid, { x: maxWidth/2, y: maxHeight/2})
    peakFountain.f.speed = map(bassEnergy, 0, 255, 0, 10);
    peakFountain2.f.speed = map(lowMid, 0, 255, 0, 10);
    peakFountain.Draw();
    peakFountain2.Draw();
    if (peakDetect.isDetected) {
        if (peakNumber % 2) {
            peakFountain.CreateN();
        } else {
            peakFountain2.CreateN();
        }
        peakNumber += 1;
        
    }
    peakFountain.Step();
    peakFountain2.Step();

    


}

function renderCircle(color, energy, { x, y }, fountain) {
    fill(color);
    const size = map(energy, 0, 255, 10, maxHeight/2);
    ellipse(x, y, size, size);

    /*fountain.f.speed = map(energy, 0, 255, 1, 3);
    fountain.f.gravity = map(energy, 0, 255, -1, 0.3);
    fountain.f.speedx = map(energy, 0, 255, 0, 6) ;
    fountain.Draw();
    fountain.Create();
    fountain.Step();*/
}
