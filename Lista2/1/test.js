//vertex shadery
var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=5.0; \n"+
    "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
    "} \n";

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

//constructor potrzebny do ustalenia parametrow dla kadzego obiektu
var dataInit= function(){
    data={};
    data.background=[0,0,0,1];

    data.objects = [];
    
    var object1 = {}; //pierwszy obiekt
    object1.position=[0,0,0]; //pozycja pierwszego obiektu względem canvas'u
    object1.colorRGB=[0, 1.0, 0]; //RGB kolor obiektu
    object1.bufferId = gl.createBuffer(); //bufferId pierwszego obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object1.bufferId ); //dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId pierwszego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.95,0.95, -0.8, 0.8]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object1.floatsPerVertex=2;
    object1.NumberOfVertices=2;
    object1.drawMode=gl.POINTS; //ustala wygląd obiektu dla metod graficznych, POINTS
    data.objects.push(object1); //push potrzebny do "pusha" obiektu
    
    
    var object2 = {}; //drugi obiekt
    object2.position=[0,0,0];//pozycja drugiego obiektu względem canvas'u
    object2.colorRGB=[0, 1.0, 1.0];//RGB kolor obiektu
    object2.bufferId = gl.createBuffer(); //bufferId drugiego obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object2.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId drugiego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.65,0.95, -0.6, 0.75, -0.35, 0.7]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object2.floatsPerVertex=2;
    object2.NumberOfVertices=3;
    object2.drawMode=gl.LINE_STRIP; //ustala wygląd obiektu dla metod graficznych, LINE_STRIP
    data.objects.push(object2); //push potrzebny do "pusha" obiektu
    
    var object3 = {}; //trzeci obiekt
    object3.position=[0,0,0];//pozycja trzeciego obiektu względem canvas'u
    object3.colorRGB=[1.0, 1.0, 1.0];//RGB kolor obiektu
    object3.bufferId = gl.createBuffer();//bufferId trzeciego obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object3.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId trzeciego obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0.95, 0.3, 0.95, 0.2, 0.7]) , gl.STATIC_DRAW );//zaladowac forme obiektu
    object3.floatsPerVertex=2;
    object3.NumberOfVertices=3;
    object3.drawMode=gl.LINE_LOOP;//ustala wygląd obiektu dla metod graficznych, LINE_LOOP
    data.objects.push(object3);//push potrzebny do "pusha" obiektu
    
    var object4 = {};//czwarty obiekt
    object4.position=[0,0,0];//pozycja 4-go  obiektu względem canvas'u
    object4.colorRGB=[1.0, 0, 0];//RGB kolor obiektu
    object4.bufferId = gl.createBuffer();//bufferId 4-go obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object4.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId 4-go obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.5, 0.95, 
                                                    0.7, 0.95, 
                                                    0.5, 0.7, 
                                                    0.7, 0.7]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object4.floatsPerVertex=2;
    object4.NumberOfVertices=4;
    object4.drawMode=gl.LINES;//ustala wygląd obiektu dla metod graficznych, LINES
    data.objects.push(object4);//push potrzebny do "pusha" obiektu
    
    var object5 = {};//piaty obiekt
    object5.position=[0,0,0];//pozycja 5-go  obiektu względem canvas'u
    object5.colorRGB=[1.0, 0, 0];//RGB kolor obiektu
    object5.bufferId = gl.createBuffer();//bufferId 5-go obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object5.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId 5-go obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.7, 0, 
                                                    -0.7, -0.5, 
                                                    -0.5, -0.6, 
                                                    -0.8, -0.8]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object5.floatsPerVertex=2;
    object5.NumberOfVertices=4;
    object5.drawMode=gl. TRIANGLE_STRIP;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_STRIP
    data.objects.push(object5);//push potrzebny do "pusha" obiektu

    var object6 = {};//szosty obiekt
    object6.position=[0,0,0];//pozycja 6-go  obiektu względem canvas'u
    object6.colorRGB=[0, 0, 1.0];//RGB kolor obiektu
    object6.bufferId = gl.createBuffer();//bufferId 6-go obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object6.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId 6-go obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0,
                                                     0, 0.2,
                                                     0.1, 0.1,
                                                     0.2, 0.05,
                                                     0.3, -0.1,
                                                     0.2, -0.2,
                                                     0.1, -0.2]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object6.floatsPerVertex=2;
    object6.NumberOfVertices=7;
    object6.drawMode=gl. TRIANGLE_FAN;//ustala wygląd obiektu dla metod graficznych, TRIANGLE_FAN
    data.objects.push(object6);//push potrzebny do "pusha" obiektu
    
    var object7 = {};//siodmy obiekt
    object7.position=[0,0,0];//pozycja 7-go  obiektu względem canvas'u
    object7.colorRGB=[1.0, 1.0, 0];//RGB kolor obiektu
    object7.bufferId = gl.createBuffer();//bufferId 7-go obiektu
    gl.bindBuffer(gl.ARRAY_BUFFER, object7.bufferId );//dodajemy do buffora ARRAY_BUFFER, potrzebny do przechowywania danych oraz bufferId 7-go obiektu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.5, -0.7,
                                                     0.7, -0.9,
                                                     0.8, -0.8,
                                                     0.5, 0,
                                                     0.5, -0.4,
                                                     0.9, -0.4]) , gl.STATIC_DRAW ); //zaladowac forme obiektu
    object7.floatsPerVertex=2;
    object7.NumberOfVertices=6;
    object7.drawMode=gl.TRIANGLES;//ustala wygląd obiektu dla metod graficznych, TRIANGLES
    data.objects.push(object7);//push potrzebny do "pusha" obiektu
}

var drawObject=function( obj ) {
    //narysowac obiekty
    gl.useProgram( glObjects.shaderProgram );
    gl.lineWidth(5); //szerekosc linii
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation); //wlaczamy VertexAttribArray
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId ); //odnosimy sie do buffora
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.uniform3fv( glObjects.uMoveLocation, obj.position );//dodajemy do uniform3fv miejsce do narysowania, pozycje obiektu
    gl.uniform3fv( glObjects.uColorRGBLocation, obj.colorRGB );//dodajemy do uniform3fv miejsce do narysowania figury, pozycje kolorow i sam RGB odpowiedniego koloru
    gl.drawArrays(obj.drawMode, 0 /* offset */, obj.NumberOfVertices/* liczba wierzcholkow */);
}

//funkcja do narysowania na canvasie
var redraw = function() {
    var bg = data.background;
    //oczyszcamy canvas
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //rysujemy obiekty
    for (var i = 0; i < data.objects.length; i++)
        drawObject(data.objects[i]);
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

    //laczamy webgl
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
        gl.bindAttribLocation(shaderProgram, 1, "aVertexPosition"); //warunek 1-c (aby przypisać zmienne attribute variable do ustalonych przez użytkownika indeksów generic vertex index)
    gl.linkProgram(shaderProgram);//otrzymujemy wynik, tzn odpowiednia figure z shaderami, fragmentami, kolorem i pozycja do rysowania
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { //sprawdzenie na poprawnosc
        console.log("Could not initialise shaders");
        console.log(gl);
        return null;
    }
    return shaderProgram;//zwrocenie wyniku 
};


//funkcja potrzebna do przeprowadzenia rysowan w okienku
window.onload= function(){
    htmlInit();//constructor do html
    glInit( html.canvas );//constructor do webgl
    dataInit();//constructor do ustalenia kadzego obiektu
    redraw(); //funkcja potrzebna do rysowania
    
    const numAttribs = gl.getProgramParameter(glObjects.shaderProgram, gl.ACTIVE_ATTRIBUTES);//pobieramy shadery oraz aktywne atrybuty
    for (let i = 0; i < numAttribs; ++i) {
      const info = gl.getActiveAttrib(glObjects.shaderProgram, i); 
      console.log('Attribut name:', info.name, 'type:', info.type, 'size:', info.size); //nazwa, typ, rozmiar kazdego obiektu
    }

    const numUniforms = gl.getProgramParameter(glObjects.shaderProgram, gl.ACTIVE_UNIFORMS);//pobieramy shadery oraz aktywne formy
    for (let i = 0; i < numUniforms; ++i) {
      const info = gl.getActiveUniform(glObjects.shaderProgram, i); //warunek 1-b (aby wypisać listę zmiennych uniform)
      console.log('Uniform name:', info.name, 'type:', info.type, 'size:', info.size); //nazwa, typ, rozmiar kazdego obiektu
    }
    console.log("Attibut aVertexPosition location= "+glObjects.aVertexPositionLocation);//wypisywanie
};