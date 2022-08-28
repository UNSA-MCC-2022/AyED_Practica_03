let qt;
let count = 0;

// Dibujar tres (3) puntos [Punto 4]
// function setup() {
//     let quadCanvas = createCanvas(400, 400);
//     quadCanvas.parent("QuadTreeCanvas");
//     let boundary = new Rectangle(200, 200, 200, 200);
//     qt = new QuadTree(boundary, 4);

//     console.log(qt);
//     for (let i = 0; i < 3; i++) {
//         let p = new Point(Math.random() * 400, Math.random() * 400);
//         qt.insert(p);
//     }

//     background(0);
//     qt.show();
// }

function setup() {
    let quadCanvas = createCanvas(400, 400);
    quadCanvas.parent("QuadTreeCanvas");

    let boundary = new Rectangle(200, 200, 200, 200);
    qt = new QuadTree(boundary, 4);

    console.log(qt);

    for (let i = 0; i < 50; i++) {
        let p = new Point(random(width), random(height));
        qt.insert(p);
    }
    background(0);
    qt.show();
}

// Dibujar puntos con Mouse [Punto 6]
// function draw() {
//     background(0);
//     if (mouseIsPressed) {
//         for (let i = 0; i < 1; i++) {
//             let m = new Point(mouseX + random(-5, 5), mouseY + random(-5,5));
//             console.log(m);
//             qt.insert(m);
//         }
//     }
//     qt.show();
// }

function draw() {
    background(0);
    qt.show();
    stroke(0, 255, 0);
    rectMode(CENTER);
    let range = new Rectangle(mouseX, mouseY, 50, 50);
    rect(range.x, range.y, range.w * 2, range.h * 2);
    //let points = [];
    //qt.query (range , points );
    let points = qt.query(range);
    for (let p of points) {
        strokeWeight(6);
        point(p.x, p.y);
    }
}