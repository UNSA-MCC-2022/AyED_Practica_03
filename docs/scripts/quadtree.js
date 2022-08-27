class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x; // center
        this.y = y;
        this.w = w; // half width
        this.h = h; // half height
        this.left = x - w / 2;
        this.right = x + w / 2;
        this.top = y - h / 2;
        this.bottom = y + h / 2;
    }

    // verifica si este objeto contiene un objeto Punto
    contains(point) {
      return (this.left <= point.x && point.x <= this.right && this.top <= point.y && point.y <= this.bottom);
    }

    // verifica si este objeto se intersecta con otro objeto Rectangle
    intersects(range) {
      return !(this.right < range.left || range.right < this.left || this.bottom < range.top || range.bottom < this.top);
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary; // Rectangle
        this.capacity = n; // capacidad maxima de cada cuadrante
        this.points = []; // vector , almacena los puntos a almacenar
        this.divided = false;
    }

    // divide el quadtree en 4 quadtrees
    subdivide() {
        // Algoritmo
        // 1: Crear 4 hijos: qt_northeast, qt_northwest, qt_southeast,qt_southwest



        // 2: Asignar los QuadTree creados a cada hijo
        // this.northeast = qt_northeast;
        // this.northwest = qt_northwest;
        // this.southeast = qt_southeast;
        // this.southwest = qt_southwest;

        // 3.- Hacer: this.divided <- true
        this.northeast = new QuadTree(this.boundary.subdivide('qt_northeast'), this.capacity);
        this.northwest = new QuadTree(this.boundary.subdivide('qt_northwest'), this.capacity);
        this.southeast = new QuadTree(this.boundary.subdivide('qt_southeast'), this.capacity);
        this.southwest = new QuadTree(this.boundary.subdivide('qt_southwest'), this.capacity);
    
        this.divided = true; 
    }

    insert(point) {
        // Algoritmo
        // 1: Si el punto no esta en los limites ( boundary ) del quadtree Return

        // 2: Si ( this.points.length ) < ( this.capacity ),
        // 2.1 Insertamos en el vector this.points
        // Sino
        // 2.2 Dividimos si aun no ha sido dividido
        // 2.3 Insertamos recursivamente en los 4 hijos.
        // this.northeast.insert ( point );
        // this.northwest.insert ( point );
        // this.southeast.insert ( point );
        // this.southwest.insert ( point );
        if (!this.boundary.contains(point)) {
          return false;
        }
    
        if (!this.divided) {
          if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
          }
    
          this.subdivide();
        }
    
        return (this.northeast.insert(point) || this.northwest.insert(point) || this.southeast.insert(point) || this.southwest.insert(point));

    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }

        for (let p of this.points) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }
}

