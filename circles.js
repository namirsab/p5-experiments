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

var prevParticle = { location: { x: 0, y: 0 }};
function myPoint(fountain, particle) {

    stroke(color(255, random(255), random(255)));
    strokeWeight(particle.partSize);
    line(particle.location.x, particle.location.y, prevParticle.location.x, prevParticle.location.y);
    prevParticle = particle;
}

function setup() {
    canvas = createCanvas(maxWidth, maxHeight, P2D);
    // Maptastic(canvas.id());
    print(canvas);
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect(20, 20000, 0.10, 60);
    song.start();
    fft.setInput(song);

    Fountain_display('text', ftext);
    Fountain_display('line', myPoint);

    var t =
    {
        name: "test",
        colors: ["yellow"],
        gravity: 0.00,
        lifetime: 400,
        angle: [0,360],
        size: [2,8],
        rate: [1, 1],
        speed: 2,
        speedx: 100,
        x: 0.5,
        y: 0.5,
        rotation: 0,
    };

    peakFountain = new Fountain(null, Object.assign({}, t, {
        colors: ['yellow'],
        x: 0.5,
        y: 0.5,
        rate: [1,200],
        angle: [0, 360],
        size: [1, 15],
        speedx: 0.2,
        speed: 3,
    }));

    peakFountain2 = new Fountain(null, Object.assign({}, t, {
        colors: ['blue'],
        x: 0.5,
        y: 0.5,
        lifetime: 500,
        rate: [2,7],
        angle: [0, 360],
        size: [3, 18],
        speedx: 0.2,
        speed: 3,
        shape: 'line'
    }));

    

    
}

var peakNumber = 0;
function draw() {
    var spectrum = fft.analyze();
    peakDetect.update(fft);
    var bassEnergy = fft.getEnergy('bass');
    var lowMid = fft.getEnergy('lowMid');
    var treble = fft.getEnergy('treble');
    background(0);
    noStroke();
    renderCircle(color(bassEnergy,0,0), bassEnergy, { x: maxWidth/2, y: maxHeight/2})
    renderCircle(color(0,lowMid,0), lowMid, { x: maxWidth/4, y: maxHeight/2})
    renderCircle(color(0,lowMid,0), lowMid, { x: maxWidth - maxWidth/4, y: maxHeight/2})
    renderCircle(color(0,0,treble), treble, { x: maxWidth/2, y: maxHeight/4})
    renderCircle(color(0,0,treble), treble, { x: maxWidth/2, y: maxHeight - maxHeight/4})
    peakFountain.f.speed = map(bassEnergy, 0, 255, 0, 10);
    peakFountain2.f.speed = map(lowMid, 0, 255, 0, 10);
    peakFountain.f.gravity = map(bassEnergy, 0, 255, -0.3, 0.1);
    peakFountain2.f.gravity = map(lowMid, 0, 255, -0.3, 0.1);
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
}
