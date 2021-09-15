var song;
var fft;
var canvas;
var barWidth;
var maxWidth;
var maxHeight;
var peakFountain;
var peakFountain2;
var peakDetect;
var imgCumbia;
var mask;

var prevParticle = { location: { x: 0, y: 0 }};
function crazyLines(fountain, particle) {

    stroke(color(255, random(255), random(255)));
    strokeWeight(particle.partSize);
    line(particle.location.x, particle.location.y, prevParticle.location.x, prevParticle.location.y);
    prevParticle = particle;
    
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
    song = new p5.AudioIn();
    maxWidth = displayWidth - 100;
    maxHeight = displayHeight  - 110;

    imgCumbia = loadImage('./assets/mascara.png');
    mask = loadImage('./assets/cnb.png');
    imageMode(CENTER);
    mask.mask(imgCumbia);
    canvas = createCanvas(maxWidth, maxHeight, P2D);
    // Maptastic(canvas.id());
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect(20, 20000, 0.10, 60);
    song.start();
    fft.setInput(song);

    Fountain_display('line', crazyLines);
    Fountain_display('polygons', randomPolygon);

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
        rate: [1,100],
        angle: [0, 360],
        size: [1, 5],
        speedx: 0.2,
        speed: 3,
        shape: 'polygons',
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
    renderImage('red', bassEnergy, { x: maxWidth/2, y: maxHeight/2})
    //renderCircle('green', lowMid, { x: maxWidth/4, y: maxHeight/2})
    //renderCircle('green', lowMid, { x: maxWidth - maxWidth/4, y: maxHeight/2})
    //renderCircle(color(0,0,treble), treble, { x: maxWidth/2, y: maxHeight/4})
    //renderCircle(color(0,0,treble), treble, { x: maxWidth/2, y: maxHeight - maxHeight/4})
    peakFountain.f.speed = map(bassEnergy, 0, 255, 0, 10);
    // peakFountain2.f.speed = map(lowMid, 0, 255, 0, 10);
    peakFountain.f.gravity = map(bassEnergy, 0, 255, -0.3, 0.1);
    // peakFountain2.f.gravity = map(lowMid, 0, 255, -0.3, 0.1);
    peakFountain.Draw();
    // peakFountain2.Draw();
    if (peakDetect.isDetected) {
        if (peakNumber % 2) {
            background('green');
            peakFountain.CreateN();
        } else {
            background('red');
            peakFountain.CreateN();

        }
        peakNumber += 1;
        
    }
    peakFountain.Step();
    peakFountain2.Step();

    

}

function renderImage(color, energy, { x, y }, fountain) {
    var size = map(energy, 0, 255, 10, maxHeight);
    image(mask, x, y, size + 100, size);
}

function renderCircle(color, energy, { x, y }, fountain) {
    fill(color);
    const size = map(energy, 0, 255, 0, maxHeight/2);
    ellipse(x, y, size + 100, size);
}

function mousePressed() {
    userStartAudio();
}