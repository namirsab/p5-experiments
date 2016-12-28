let tileMatrix = [];

function renderTiles({ numOfTiles, center, tileWidth, energy, mainColor }) {

    const threshold = map(energy, 0, 255, 0, numOfTiles / 2);
    for (let i = 0; i < numOfTiles; i += 1) {
        tileMatrix[i] = tileMatrix[i] || [];
        const x = tileWidth * i;
        for (let j = 0; j < numOfTiles; j += 1) {
            tileMatrix[i][j] = tileMatrix[i][j] || {};
            const y = tileWidth * j;
            const r = random(0, energy - 100);
            const g = random(0, energy - 100);
            const b = random(0, energy - 100);
            const distanceToCenter = distance({ pointA: { x: i, y: j }, pointB: { x: center.i, y: center.j } });
            if (isCloseToCenter(i, j, center, threshold)) {
                const relaxingFactor = map(distanceToCenter, 0, 16, 0, 6);
                let paintColor;
                const previousColor = tileMatrix[i][j].color;
                switch (mainColor) {
                    case 'r':
                        paintColor = color(energy / relaxingFactor, g / relaxingFactor, b / relaxingFactor);
                        break;
                    case 'g':
                        paintColor = color(r / relaxingFactor, energy / relaxingFactor, b / relaxingFactor);
                        break;
                    case 'b':
                        paintColor = color(r / relaxingFactor, g / relaxingFactor, energy / relaxingFactor);
                        break;
                }

                if (previousColor) {
                    paintColor = lerpColor(previousColor, paintColor, 0.5);
                }
                tileMatrix[i][j] = tile2({ x, y, w: tileWidth, color: paintColor });
            }
        }
    }
}

function drawTiles() {
    tileMatrix.forEach(tilesRow => {
        tilesRow
            .filter(tileElement => Object.keys(tileElement).length !== 0)
            .forEach(tileElement => {
                tile(tileElement);
        });
    });

}

function getTileColor(i, j, tileWidth) {
    const x = tileWidth * i;
    const y = tileWidth * j;

    const [r, g, b] = get(x, y);

    return color(r, g, b);
}


function distance({ pointA, pointB }) {
    const xDelta = pointB.x - pointA.x;
    const yDelta = pointB.y - pointA.y;
    return Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));
}

function isCloseToCenter(i, j, center, threshold) {
    const { differenceI, differenceJ } = differencesToCenter(i, j, center);

    const t = Math.trunc(threshold);
    const thresholdCondition =
        differenceI < t && differenceJ < t;

    const borderConditionI = differenceI === t && differenceJ < t;
    const borderConditionJ = differenceJ === t && differenceI < t;


    const randomCondition = Math.random() > 0.5;

    return (
        thresholdCondition ||
        (borderConditionI && randomCondition) ||
        (borderConditionJ && randomCondition)
    );
}

function differencesToCenter(i, j, center) {
    const differenceI = Math.abs(i - center.i);
    const differenceJ = Math.abs(j - center.j);

    return { differenceI, differenceJ };
}


function tile2({ x, y, w, color, gr }) {
    return {
        x,
        y,
        w,
        color
    }
}


function tile({ x, y, w, color, gr}) {
    if (!gr) {
        fill(color);
        noStroke();
        rect(x, y, w, w);
    } else {
        gr.fill(color);
        gr.noStroke();
        gr.rect(x, y, w, w);
    }
}
