/// <reference path="babylon.js" />
//use babylon for graphics
"use strict";

// Size of a cube/block
var BLOCK_SIZE = 8;
// Are we inside the maze 
var QRCodeView = false;
var freeCamera, canvas, engine, sceneShow;
var camPositionInLabyrinth, camRotationInLabyrinth;

function createQRCodeMaze() {
    //number of modules count or cube in width/height
    // It needs a HTML element to work with
var qrcode = new QRCode(document.createElement("div"), { width: 400, height: 400 });

qrcode.makeCode( "Grafika");

// needed to set the proper size of the playground
var mCount = qrcode._oQRCode.moduleCount;

    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.8, 0);
    scene.collisionsEnabled = true;

    freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 5, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    groundMaterial.emissiveTexture.uScale = mCount;
    groundMaterial.emissiveTexture.vScale = mCount;
    groundMaterial.bumpTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_b010.jpg", scene);
    groundMaterial.bumpTexture.uScale = mCount;
    groundMaterial.bumpTexture.vScale = mCount;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_s100-g100-r100.jpg", scene);
    groundMaterial.specularTexture.uScale = mCount;
    groundMaterial.specularTexture.vScale = mCount;

    //get the X,Y,Z coordinates for the ground
    var ground = BABYLON.Mesh.CreateGround("ground", (mCount + 2) * BLOCK_SIZE, (mCount + 2) * BLOCK_SIZE, 1, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    //Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;

    // the labyrinth

    var row = 15;//the number of rows
    var col = 20;//the number of columns

    var cubeTopMaterial = new BABYLON.StandardMaterial("cubeTop", scene);
    cubeTopMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.15);

    var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
    cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/masonry-wall-texture.jpg", scene);
    cubeWallMaterial.bumpTexture = new BABYLON.Texture("textures/masonry-wall-bump-map.jpg", scene);
    cubeWallMaterial.specularTexture = new BABYLON.Texture("textures/masonry-wall-normal-map.jpg", scene);

    var cubeMultiMat = new BABYLON.MultiMaterial("cubeMulti", scene);
    cubeMultiMat.subMaterials.push(cubeTopMaterial);
    cubeMultiMat.subMaterials.push(cubeWallMaterial);

    for (var row = 0; row < mCount; row++) {
        for (var col = 0; col < mCount; col++) {
            if (qrcode._oQRCode.isDark(row, col)) { //standard case to create the maze
                var soloCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCube.subMeshes = [];
                soloCube.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCube));
                soloCube.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, soloCube));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCube.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCube.material = cubeMultiMat;
                soloCube.checkCollisions = true;
                soloCube.position = new BABYLON.Vector3(BLOCK_SIZE / 2 + (row - (mCount / 2)) * BLOCK_SIZE,BLOCK_SIZE / 2,BLOCK_SIZE / 2 + (col - (mCount / 2)) * BLOCK_SIZE);
            } else { //case when we want to have empty zones in the maze. Also here we get the bounds of the maze

                var soloCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCube.subMeshes = [];
                soloCube.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCube));
                soloCube.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, soloCube));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCube.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCube.material = cubeMultiMat;
                soloCube.checkCollisions = true;     
                soloCube.position = new BABYLON.Vector3(110,1,(BLOCK_SIZE / 2 + (col - (mCount / 2)) * (BLOCK_SIZE+1))+1);
                // 1 size of the maze
                
                var solCube = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                solCube.subMeshes = [];
                solCube.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, solCube));
                solCube.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, solCube));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                solCube.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                solCube.material = cubeMultiMat;
                solCube.checkCollisions = true;
                solCube.position = new BABYLON.Vector3(-110,1,(BLOCK_SIZE / 2 + (col - (mCount / 2)) * (BLOCK_SIZE+1))+1); 
                // 2 size of the maze

                var soloCubeY = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCubeY.subMeshes = [];
                soloCubeY.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCubeY));
                soloCubeY.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, soloCubeY));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCubeY.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCubeY.material = cubeMultiMat;
                soloCubeY.checkCollisions = true;
                soloCubeY.position = new BABYLON.Vector3(-col*5,2,-110);
                // 3 (1st part of wall) size of the maze

                var soloCubeYMinus = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCubeYMinus.subMeshes = [];
                soloCubeYMinus.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCubeYMinus));
                soloCubeYMinus.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30,soloCubeYMinus ));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCubeYMinus.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCubeYMinus.material = cubeMultiMat;
                soloCubeYMinus.checkCollisions = true;
                soloCubeYMinus.position = new BABYLON.Vector3(col*5,2,-110);
                // 3 (2nd part of wall) size of the maze

                var soloCubeYII = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCubeYII.subMeshes = [];
                soloCubeYII.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCubeYII));
                soloCubeYII.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, soloCubeYII));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCubeYII.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCubeYII.material = cubeMultiMat;
                soloCubeYII.checkCollisions = true;
                soloCubeYII.position = new BABYLON.Vector3(-col*5,2,110);
                // 4 (1st part of wall) size of the maze

                var soloCubeYIIMinus = BABYLON.Mesh.CreateBox("mainCube", BLOCK_SIZE, scene);
                soloCubeYIIMinus.subMeshes = [];
                soloCubeYIIMinus.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, soloCubeYIIMinus));
                soloCubeYIIMinus.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30,soloCubeYIIMinus ));
                // same as soloCube.rotation.x = -Math.PI / 2; 
                // but cannon.js needs rotation to be set via Quaternion
                soloCubeYIIMinus.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
                soloCubeYIIMinus.material = cubeMultiMat;
                soloCubeYIIMinus.checkCollisions = true;
                soloCubeYIIMinus.position = new BABYLON.Vector3(col*5,2,110);
                // 4 (2nd part of wall) size of the maze
            }
        }
    }

var x = BLOCK_SIZE / 2 + (7 - (mCount / 2)) * BLOCK_SIZE;
var y = BLOCK_SIZE / 2 + (1 - (mCount / 2)) * BLOCK_SIZE;
freeCamera.position = new BABYLON.Vector3(x, 5, y);//position of the camera
    return scene;
};

window.onload = function () { //function to get canvas from the index.html
    canvas = document.getElementById("canvas");

    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        sceneShow = createQRCodeMaze("Grafika");
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        sceneShow.activeCamera.attachControl(canvas);

        engine.runRenderLoop(function () {
            sceneShow.render();
        });
    }
};