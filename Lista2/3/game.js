//vertex shadery
var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main( void ) { \n";
   

//fragment shadery
var fragmentShaderSrc= ""+
    "precision mediump float; \n"+ 
    "uniform vec3 uColorRGB; \n"+ 
    "void main( void ) { \n"+
    "  gl_FragColor = vec4( uColorRGB, 1.0 ); \n"+
    "} \n";

var gl; //GL kontekst
var glObjects; //GL obiekty
var html; //HTML obiekty
var data; //dane uzytkownika
var size = 15; //rozmiar klocku
var delta = 100;//stala czasowa
var end = false;//stala do sprawdzenia tego czy juz jest koniec gry

//constructor potrzebny do 
var dataInit= function(){
    data={};
    data.background=[0,0,0,1];
    data.speed = 2 / size;//predkosc ruchania klocku
    data.snake = [];//klocki ktore sa we weza
    
    //animacja obiektu
    var head={};
    head.direction= [0,0,0];
    head.prevDirection= [1,0,0];
    //parametry dla drawObject
    head.colorRGB=[1.0, 1.0, 0];//RGB kolor
    var mid = Math.floor(size/2);
    head.position = [-1 + data.speed*(mid+0.5),-1 + data.speed*(mid+0.5),-1];//pozycja "glowy weza"
    head.bufferId = gl.createBuffer();//bufferId weza
    gl.bindBuffer(gl.ARRAY_BUFFER, head.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]) , gl.STATIC_DRAW ); //ladujemy forme "glowy"
    head.floatsPerVertex=2;
    head.NumberOfVertices=1;
    head.drawMode=gl.POINTS;//ustala wygląd obiektu dla metod graficznych, POINTS
    
    data.snake.push(head);//push potrzebny do "pusha" obiektu
    
    data.food={};
    //parametery dla drawObject
    data.food.colorRGB=[1.0, 0, 0];
    var randx = Math.floor(Math.random()*size);//ustalenie random pozycji wzgledem x
    var randy = Math.floor(Math.random()*size);//ustalenie random pozycji wzgledem y
    if (randx > size-1)
        randx = size-1;//sprawdzenie tego czy nie jest pozycja x wieksza od rozmiaru ekranu
     if (randy > size-1)
        randy = size-1;//sprawdzenie tego czy nie jest pozycja y wieksza od rozmiaru ekranu
    data.food.position=[-1 + data.speed*(randx+0.5), -1 + data.speed*(randy+0.5), 0];//ustalenie pozycji
    data.food.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  data.food.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]) , gl.STATIC_DRAW ); //ladujemy forme "glowy"
    data.food.floatsPerVertex=2;
    data.food.NumberOfVertices=1;
    data.food.drawMode=gl.POINTS;//ustala wygląd obiektu dla metod graficznych, POINTS
    
    //animacja
    data.animation={};
    data.animation.requestId=0;

    //RGB kolory elementow graficznych naszej gry
    data.kot=[];
    var kolorKota = [0.7, 0.7, 0.7];
    var kolorKota2 = [0.2, 0.2, 0.2];
    var kolorKota3 = [0, 0.1, 0.8];
    
    //parametry dla drawObject
    var object2 = {};
    object2.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object2.colorRGB=kolorKota2;//RGB kolor obiektu
    object2.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object2.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.94,  0.75, 
				      -0.94,  -0.02, 
				      -0.59,  0.38] ) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object2.floatsPerVertex=2;
    object2.NumberOfVertices=3;
    object2.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object2);//push potrzebny do "pusha" obiektu
    
    var object3 = {};
    object3.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object3.colorRGB=kolorKota2;//RGB kolor obiektu
    object3.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object3.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.59,  0.38, 
				      -0.22,  0.75, 
				      -0.22,  -0.02] ) , gl.STATIC_DRAW ); //zaladowac forme obiektu
   object3.floatsPerVertex=2;
    object3.NumberOfVertices=3;
    object3.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object3);//push potrzebny do "pusha" obiektu
    
    var object4 = {};
    object4.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object4.colorRGB=kolorKota;//RGB kolor obiektu
    object4.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object4.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.59,  0.38, 
				      -0.22,  -0.02, 
                      -0.59,  -0.38,
				      -0.94,  -0.02] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object4.floatsPerVertex=2;
    object4.NumberOfVertices=4;
    object4.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object4);//push potrzebny do "pusha" obiektu
    
    var object5 = {};
    object5.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object5.colorRGB=kolorKota;//RGB kolor obiektu
    object5.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object5.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.22,  -0.02, 
                      -0.59,  -0.38,
                      -0.22,  -0.76,
                      0.16,  -0.38] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object5.floatsPerVertex=2;
    object5.NumberOfVertices=4;
    object5.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object5);//push potrzebny do "pusha" obiektu
    
    var object5 = {};
    object5.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object5.colorRGB=kolorKota2;//RGB kolor obiektu
    object5.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object5.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.59,  -0.38,
                      -0.22,  -0.76, 
				      -0.94,  -0.76] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object5.floatsPerVertex=2;
    object5.NumberOfVertices=3;
    object5.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object5);//push potrzebny do "pusha" obiektu
    
     var object6 = {};
    object6.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object6.colorRGB=kolorKota2;//RGB kolor obiektu
    object6.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object6.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.22,  -0.76,
                      0.16,  -0.38, 
				      0.53,  -0.76] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object6.floatsPerVertex=2;
    object6.NumberOfVertices=3;
    object6.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object6);//push potrzebny do "pusha" obiektu
    
    var object7 = {};
    object7.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object7.colorRGB=kolorKota;//RGB kolor obiektu
    object7.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object7.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.22,  -0.02, 
                      0.16,  -0.38,
                      0.53, -0.02,
                      0.53,  -0.76] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object7.floatsPerVertex=2;
    object7.NumberOfVertices=4;
    object7.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object7);//push potrzebny do "pusha" obiektu
    
    var object8 = {};
    object8.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object8.colorRGB=kolorKota;//RGB kolor obiektu
    object8.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object8.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([  0.53,  -0.76,
                      0.53, -0.02,
                      0.87, -0.38] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object8.floatsPerVertex=2;
    object8.NumberOfVertices=3;
    object8.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object8);//push potrzebny do "pusha" obiektu
    
     var object9 = {};
    object9.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object9.colorRGB=kolorKota;//RGB kolor obiektu
    object9.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object9.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([  0.53,  -0.02,
                      0.87, -0.38,
                      0.87, 0.38] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object9.floatsPerVertex=2;
    object9.NumberOfVertices=3;
    object9.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object9);//push potrzebny do "pusha" obiektu
    
    var object10 = {};
    object10.position=[0,0, 0.7];//pozycja obiektu względem canvas'u
    object10.colorRGB=kolorKota2;//RGB kolor obiektu
    object10.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object10.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([  0.53,  -0.02,
                      0.87, 0.38,
                       0.53,  0.75] ) , gl.STATIC_DRAW ); //zaladowac forme obiektu
   object10.floatsPerVertex=2;
    object10.NumberOfVertices=3;
    object10.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object10);//push potrzebny do "pusha" obiektu
    
    var object11 = {};
    object11.position=[0,0, 0.6];//pozycja obiektu względem canvas'u
    object11.colorRGB=kolorKota3;//RGB kolor obiektu
    object11.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object11.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([  -0.75,  0.11,
                      -0.62,  0.11,
                       -0.69, 0.05] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object11.floatsPerVertex=2;
    object11.NumberOfVertices=3;
    object11.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object11);//push potrzebny do "pusha" obiektu
    
    var object12 = {};
    object12.position=[0,0, 0.6];//pozycja obiektu względem canvas'u
    object12.colorRGB=kolorKota3;//RGB kolor obiektu
    object12.bufferId = gl.createBuffer();//bufferId obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object12.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId tego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([  -0.53,  0.11,
                      -0.40,  0.11,
                       -0.46, 0.05] ) , gl.STATIC_DRAW );//zaladowac forme obiektu
   object12.floatsPerVertex=2;
    object12.NumberOfVertices=3;
    object12.drawMode=gl.TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.kot.push(object12);//push potrzebny do "pusha" obiektu
}

var drawObject=function( obj ) {
    //narysowac obiekty
    gl.useProgram( glObjects.shaderProgram );
    gl.lineWidth(3); //szerekosc linii
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);//wlaczamy VertexAttribArray
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId );  //odnosimy sie do buffora
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.uniform3fv( glObjects.uMoveLocation, obj.position );//dodajemy do uniform3fv miejsce do narysowania, pozycje obiektu
    gl.uniform3fv( glObjects.uColorRGBLocation, obj.colorRGB );//dodajemy do uniform3fv miejsce do narysowania figury, pozycje kolorow i sam RGB odpowiedniego koloru
    gl.drawArrays(obj.drawMode, 0 /* offset */, obj.NumberOfVertices /* liczba wierzcholkow */);
}

//funkcja do narysowania na canvasie
var redraw = function() {
    var bg = data.background;
    //oczyszcamy canvas
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawObject(data.food);
    //rysujemy weza
    for (var i = 0; i < data.snake.length; i++)
    drawObject(data.snake[i]);

    //rysujemy background, tzn "kota"
    for (var i = 0; i < data.kot.length; i++)
        drawObject(data.kot[i]);

}

//funkcja potrzebna do znalezienia dystansu 
function distance(x, y){
    return Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
}

//funkcja potrzebna do sprawdzenia tego czy bylo zdarzenie pomiedzy blokiem a jednym z blokow weza
function collision(one, two) {
    return (distance(one.position,two.position) < data.speed/2);
}


//funkcja potrzebna do sprawdzenia tego czy bylo zdarzenie pomiedzy blokiem a blokami weza
function collisionWithSnake(one){
    for(var i = 0; i < data.snake.length; i++)
        if(collision(one, data.snake[i]))//odpalamy funkcje collision
            return true;
    return false;
}

//funkcja potrzebna do sprawdzenia zdarzen
function autoCollision(){
    for(var i = 1; i < data.snake.length; i++){
       // console.log(distance(data.snake[0].position, data.snake[i].position));
        if(collision(data.snake[0],data.snake[i])){//odpalamy funkcje collision
            console.log("TRUE");
            return true;
        }
    }
    return false;
}

//funkcja potrzebna do animacja uruchomienia weza
var animate=function( time ) {//podajemy czas z ktorym gra bedzie wykonywana, tzn predkosc naszego weza 
    var timeDelta= time-data.animation.lastTime;
    end = false;
    
    if(timeDelta > delta){//sprawdzamy czy czas jest wiekszy od stalej
        data.animation.lastTime= time ;//jezeli jest, to ustalmy czas
        for (var i = data.snake.length - 1; i > 0; i--){
            data.snake[i].position[0] = data.snake[i-1].position[0];//zmieniamy pozycje naszego weza
            data.snake[i].position[1] = data.snake[i-1].position[1];
        }
        var x=  data.snake[0].position[0]+data.snake[0].direction[0]* data.speed;//ustalamy pozycje naszego weza wzgledem osi X
        var y=  data.snake[0].position[1]+data.snake[0].direction[1]* data.speed;//ustalamy pozycje naszego weza wzgledem osi Y

        
        data.snake[0].prevDirection[0] = data.snake[0].direction[0];//ustalamy pozycje z ktorej byl uruchomiony wez
        data.snake[0].prevDirection[1] = data.snake[0].direction[1];//ustalamy pozycje z ktorej byl uruchomiony wez

        data.snake[0].position[0]= (x+3)%2 -1;
        data.snake[0].position[1]= (y+3)%2 -1;
         
        redraw();//rysujemy weza
        gl.finish();//konczymy na tym dzialanie gl
        
        if(collision(data.snake[0], data.food)){
            var segment={};
            segment.colorRGB=[0, 1.0, 0];
            //object.position = [data.snake[data.snake.length -1].position[0],data.snake[data.snake.length -1].position[1],0];
            segment.position =[10,10,0];
            segment.bufferId = gl.createBuffer();//bufferId segmentu
            gl.bindBuffer(gl.ARRAY_BUFFER, segment.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId segmentu
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
            segment.floatsPerVertex=2;
            segment.NumberOfVertices=1;
            segment.drawMode=gl.POINTS;//ustala wygląd obiektu dla metod graficznych, POINTS
            data.snake.push(segment);//push potrzebny do "pusha" obiektu
            
            while (collisionWithSnake(data.food)){//sprawdzenie tego czy sa zdarzenia pomiedzy wezem a klockiem
                var randx = Math.floor(Math.random()*size);
                var randy = Math.floor(Math.random()*size);
                if (randx > size-1)
                    randx = size-1;
                 if (randy > size-1)
                    randy = size-1;
                   data.food.position=[-1 + data.speed*(randx+0.5), -1 + data.speed*(randy+0.5), 0];
            }
        }
            
        if(autoCollision()){//jezeli tak sie stalo ze odbylo sie zdarzenie, ale tylko pomiedzy glowa a koncem naszego weza
            console.log("ZJADLES SIEBIE");
            animationStop();//koniec gry
            end = true;//ustalamy stala na true
            var canvas2 = document.getElementById("can");
            var ctx = canvas2.getContext('2d');
            var pix = canvas2.width/8;
            ctx.font = ""+pix+"px Comic Sans MS";
            var gradient=ctx.createLinearGradient(0,0,canvas2.width,0);
            gradient.addColorStop("0","green");
            gradient.addColorStop("0.5","orange");
            gradient.addColorStop("1.0","red");
            ctx.fillStyle=gradient;
            ctx.fillText("Game Over",html.canvas.width/5,html.canvas.height/2);//powiadomienie o koncu
        }
    
    }
    
    if(!end)
        data.animation.requestId = window.requestAnimationFrame(animate);//jezeli end = false, to wtedy kontynujemy animacje
}

//funkcja ktora jest potrzebna zeby zaczac animacje ruchania klocku
var animationStart= function(){
    data.animation.lastTime = window.performance.now();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

//funkcja ktora jest potrzebna zeby zatrzymac animacje ruchania klocku
var animationStop= function(){
    if (data.animation.requestId)
	window.cancelAnimationFrame(data.animation.requestId);
    data.animation.requestId = 0;
    redraw();
}

//constructor do otrzymania canvasu z pliku html
var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvas= document.querySelector('#canvasId');
};

//constructor do ustalenia canvasu i dzialania webgl na nim
var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    var pixelSize = canvas.width/(1.1*size);
    vertexShaderSrc = vertexShaderSrc +  
        "  gl_PointSize="+pixelSize+"; \n"+
        "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
        "} \n";
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    glObjects={}; 

    //tworzymy wykonujacy program webgl
    glObjects.shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );
    //dodajemy atrybuty
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, "uMove");
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, "uColorRGB");

};

//funkcja do kompilowania shaderow
var compileAndLinkShaderProgram=function ( gl, vertexShaderSource, fragmentShaderSource ){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);//ustalamy vertex shader
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);//kompilujemy vertex shader
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));//wypisujemy info o vertex shader do konsoli
	console.log(gl);//wypisujemy info o gl do konsoli
	return null;
    }

    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);//ustalamy fragment shader
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);//kompilujemy fragment shader
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));//wypisujemy info o fragment shader do konsoli
	console.log(gl);//wypisujemy info o gl do konsoli
	return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);//ladujemy shadery z gl
    gl.attachShader(shaderProgram, fragmentShader);//ladujemy fragmenty z gl
    gl.linkProgram(shaderProgram);//otrzymujemy wynik, tzn odpowiednia figure z shaderami, fragmentami, kolorem i pozycja do rysowania
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {//sprawdzenie na poprawnosc
	console.log("Could not initialise shaders");
	console.log(gl);
	return null;
    }

    return shaderProgram;//zwrocenie wyniku 
};

//funkcja potrzebna do sprawdzenia tego jakie klawisze naciska uzytkownik
var callbackOnKeyDown =function (e){
    var code= e.which || e.keyCode;
    switch(code)//przewidujemy to ze gracz moze wybrac rozne klawisze 
    {
    case 38: //up
    case 73: //I
    case 87: //W
    const numAttribs = gl.getProgramParameter(glObjects.shaderProgram, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; ++i) {
        const info = gl.getActiveAttrib(glObjects.shaderProgram, i); 
        console.log('name:', info.name, 'type:', info.type, 'size:', info.size); //wypisujemy info o ruchaniu klocku, gdzie jest : nazwa, typ, rozmiar
    }
    if(data.snake[0].prevDirection[1] != -1)
        data.snake[0].direction=[0,1];//sprawdzenie miejsca znajdowania klocku i do ktorej strony musi byc uruchomiony
	if( data.animation.requestId == 0 && !end) animationStart();
	break;
    case 40: //down
    case 75: //K
    case 83: //S
        if(data.snake[0].prevDirection[1] != 1)
            data.snake[0].direction=[0,-1];//sprawdzenie miejsca znajdowania klocku i do ktorej strony musi byc uruchomiony
	if( data.animation.requestId == 0 && !end) animationStart();
	break;
    case 37: //left
    case 74://J
    case 65: //A
        if(data.snake[0].prevDirection[0] != 1)
            data.snake[0].direction=[-1,0];//sprawdzenie miejsca znajdowania klocku i do ktorej strony musi byc uruchomiony
	if( data.animation.requestId == 0 && !end) animationStart();
	break;
    case 39://right
    case 76: //L
    case 68: //D
        if(data.snake[0].prevDirection[0] != -1)
            data.snake[0].direction=[1,0];//sprawdzenie miejsca znajdowania klocku i do ktorej strony musi byc uruchomiony
	if( data.animation.requestId == 0 && !end) animationStart();
	break;
    }
}

//funkcja potrzebna do przeprowadzenia rysowan w okienku
window.onload= function(){
    htmlInit();//constructor do html
    glInit( html.canvas );//constructor do webgl
    dataInit();//constructor do ustalenia kadzego obiektu
    redraw(); //funkcja potrzebna do rysowania
    window.onkeydown=callbackOnKeyDown;//funkcja potrzebna do lapienia tego jakie klawisze naciska uzytkownik
};