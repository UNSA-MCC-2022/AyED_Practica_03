
<img src="https://github.com/UNSA-MCC-2022/MCC_Algoritmos_2022/blob/main/logo_unsa.jpg" alt="UNSA" width="30%"/>

### Universidad Nacional de San Agustín <br/> Maestría en Ciencia de la Computación <br/>  Algoritmos y Estructura de Datos
<hr/>


# Practica 03

| DOCENTE | CARRERA | CURSO |
| :-: | :-: | :-: |
| Vicente Machaca Arceda | Maestría en Ciencia de la Computación | Algoritmos y Estructura de Datos |
<br/>

| PRÁCTICA | TEMA | DURACIÓN |
| :-: | :-: | :-: |
| 03 | Quadtree / Octree | 3 horas

## 1. Datos de los estudiantes
- Asmat Fuentes, Franz Rogger
- Esthela Espinoza, Fausto Danilo
- Ojeda Mamani, Abel Eberth
- Paredes Rodriguez, Raybert

## 2. Ejercicios

2.1. Cree un archivo _main.html_, este invocará a los archivos Javascript que vamos a crear. El archivo _p5.min.js_ es una librería para gráficos, la puede descargar de internet o se la puede pedir al profesor. En el archivo _quadtree.js_ estará todo el código de la estructura y en el archivo _sketch.js_ estará el código donde haremos pruebas del Quadtree.

```html
            <html>
            
            <head>
                <title> QuadTree </title>
                <script src="scripts/p5.min.js"> </script>
                <script src="scripts/quadtree.js"> </script>
                <script src="scripts/sketch.js"> </script>

                <style>
                    body{
                        font-family: Ubuntu, Arial, sans-serif;
                    }
                    .grid-container {
                        display: grid;
                        grid-template-columns: auto auto auto;
                        padding: 5px;
                    }
                    .grid-container>div {
                        text-align: center;
                        padding: 5px;
                    }
                </style>
            </head>
            
            <body>
                <div class="grid-container">
            		<div class="grid-item" style="vertical-align: middle;">
            			<img id="logoUnsa" src="img/logo_unsa.jpg" width="200" alt="UNSA">
            		</div>
            		<div class="grid-item">
            			<p style="font-size: 18px;font-weight: bold;">
            				Universidad Nacional de San Agust&iacute;n<br />
            				Maestr&iacute;a en Ciencias de la Computaci&oacute;n<br />
            				Algoritmos y Estructura de Datos<br />
            			</p>
            		</div>
            		<div class="grid-item">
            			<p style="font-size: 18px;font-weight: bold;">
                            Pr&aacute;ctica 03
            			</p>
                    </div>
            		<div class="grid-item">&nbsp;</div>
            		<div class="grid-item"><div id="QuadTreeCanvas"></div></div>
            		<div class="grid-item">&nbsp;</div>
            	</div>
            </body>
            </html>

```
        
2.2. En el archivo _quadtree.js_ digitemos el siguiente código, además debe completar las funciones _contains_ e _intersects_ (ambas funciones devuelven _true_ o _false_).
        
```javascript
            
            contains(point) {
                return (point.x >= this.x - this.w && 
                        point.x <= this.x + this.w && 
                        point.y >= this.y - this.h && 
                        point.y <= this.y + this.h );
            }
            
            intersects(range) {
                return !(range.x - range.w > this.x + this.w || 
                         range.x + range.w < this.x - this.w || 
                         range.y - range.h > this.y + this.h || 
                         range.y + range.h < this.y - this.h);
            }
            
```
        
2.3. En el archivo _quadtree.js_ digitemos el siguiente código y complete las funciones _subdivide_ e _insert_.
        
```javascript

            subdivide() {
                let x = this.boundary.x;
                let y = this.boundary.y;
                let w = this.boundary.w;
                let h = this.boundary.h;
                let qt_northeast = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
                let qt_northwest = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
                let qt_southeast = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
                let qt_southwest = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
                this.northeast = new QuadTree(qt_northeast, this.capacity);
                this.northwest = new QuadTree(qt_northwest, this.capacity);
                this.southeast = new QuadTree(qt_southeast, this.capacity);
                this.southwest = new QuadTree(qt_southwest, this.capacity);
                this.divided = true;
            }

            insert(point) {
                if (!this.boundary.contains(point)){
                    return false;
                }
        
                if (this.points.length < this.capacity) {
                    this.points.push(point);
                    return true;
                } 
                else {
                    if(!this.divided){                
                        this.subdivide();                
                    }
                    return (
                        this.northeast.insert(point) ||
                        this.northwest.insert(point) ||
                        this.southeast.insert(point) ||
                        this.southwest.insert(point)
                      );
                }
            }
```
        
2.4. Editemos el archivo _sketch.js_. En este archivo estamos creando un QuadTree de tamaño 400x400 con 3 puntos. Ejecute (obentrá un resultado similar a la Figura 1)
        
```javascript
            
            function setup() {
                let quadCanvas = createCanvas(400, 400);
                quadCanvas.parent("QuadTreeCanvas");
                let boundary = new Rectangle(200, 200, 200, 200);
                qt = new QuadTree(boundary, 4);
            
                console.log(qt);
                for (let i = 0; i < 3; i++) {
                    let p = new Point(Math.random() * 400, Math.random() * 400);
                    qt.insert(p);
                }
            
                background(0);
                qt.show();
            }
            
```

<p align=center>
  <img style="border:1px solid black;" src="https://github.com/UNSA-MCC-2022/AyED_Practica_03/blob/main/images/Figura_01.png" alt="UNSA" width="80%"/>
  <br />
  Figura 1: Resultado de insertar tres (3) puntos
</p>
        
2.5. Abra las opciones de desarrollador (opciones / más herramientas / opciones de desarrollador) de su navegador para visualizar la console (Figura 2).
        
<p align=center>
  <img style="border:1px solid black;" src="https://github.com/UNSA-MCC-2022/AyED_Practica_03/blob/main/images/Figura_02.png" alt="UNSA" width="80%"/>
  <br />
  Figura 2: Visualización de herramientas de desarrollo
</p>
        
2.6. Edite el archivo _sketch.js_ con el siguiente código. En este caso, nos da la posibilidad de insertar los puntos con el mouse.
        
```javascript

        function draw() {
            background(0);
            if (mouseIsPressed) {
                for (let i = 0; i < 1; i++) {
                    let m = new Point(mouseX + random(-5, 5), mouseY + random(-5,5));
                    console.log(m);
                    qt.insert(m);
                }
            }
            qt.show();
        }
        
```

<p align=center>
  <img style="border:1px solid black;" src="https://github.com/UNSA-MCC-2022/AyED_Practica_03/blob/main/images/Figura_03.png" alt="UNSA" width="80%"/>
  <br />
  Figura 3: Quadtree, inserción de puntos con mouse
</p>
        
2.7. Edite el archivo _quadtree.js_ y complete la función query.
        
```javascript
        
        query(range, found){    
            if(!found){
                found=[];
            }
            if(!this.boundary.intersects(range)){
                return found;
            }
            else{
              for(let point of this.points){
                if(range.contains(point)){
                    found.push(point)
                }
              }
              if(this.divided){            
                this.northeast.query(range,found);
                this.northwest.query(range,found);
                this.southeast.query(range,found);
                this.southwest.query(range,found);
              } 
              return found;
            }
        }
        
```
        
2.8. Editemos el archivo _sketch.js_, En este caso haremos consultas con el mouse
        
```javascript
        
        let qt;
        let count = 0;
        
        function setup () {
            createCanvas (400 ,400);
            let boundary = new Rectangle (200, 200, 200, 200);
            qt = new QuadTree (boundary , 4);
            
            console.log (qt);
            for (let i=0; i < 25; i ++) {
                let p = new Point (Math.random () * 400 , Math.random () * 400);
                qt.insert (p);
            }
            background (0);
            qt.show ();
        }
        
        function draw () {
            background (0);
            qt.show ();
            
            stroke (0 ,255 ,0);
            rectMode (CENTER);
            let range = new Rectangle (mouseX, mouseY, 50, 50);
            rect (range.x, range.y, range.w * 2, range.h * 2);
            let points = [];
            qt.query (range, points);
            
            for (let p of points) {
                strokeWeight (4);
                point (p.x, p.y);
            }
        }

```
        
<p align=center>
  <img style="border:1px solid black;" src="https://github.com/UNSA-MCC-2022/AyED_Practica_03/blob/main/images/Figura_04.png" alt="UNSA" width="80%"/>
  <br />
  Figura 3: Implementación de búsqueda (Query)
</p>
        
2.9. Finalmente, debe implementar un _Octree_ y visualizarlo. Puede utilizar cualquier lenguaje de programación.
        
```javascript

        class OcTree {
            constructor () {
            
            }
        
            insert (point){
            
            }
        
            show () {
            }
        }

```

## 3. Repositorio

La implementación de los algoritmos y los datos utilizados es el siguiente:

https://github.com/UNSA-MCC-2022/AyED_Practica_03

## 4. Representación gráfica

Se realizó la implementación de la representación gráfica de los algoritmos indicados, esto se pueden visualizar en el siguiente enlace:

https://unsa-mcc-2022.github.io/AyED_Practica_03

