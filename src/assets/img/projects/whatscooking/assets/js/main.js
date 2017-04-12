/*-------JSHint Directives-------*/
/* global THREE, dat             */
/*-------------------------------*/
'use strict';


/*******************
 * Manage Settings *
 *******************/
var CAMERA = {
  fov : 45,
  near : 1,
  far : 100000,
  zoomX : 0,
  zoomY : 20,
  zoomZ : 250,
};

var CONTROLS = {
  enabled : true,
  userPan : true,
  userPanSpeed : 1,
  minDistance : 10.0,
  maxDistance : 2000.0,
  // maxPolarAngle : (Math.PI/180) * 80,
};

var RENDERER = {
  antialias : false,
};


/********************
 * Global Variables *
 ********************/
// Built-in
var scene, camera, renderer;

// Data Points
var pointField;
var cuisineField;
var PARTICLE_SIZE = 7;
var ingredientLabel = [];
var animationData =[];
var num_cuisines;

//Interaction
var raycaster, intersects;
var mouse, INTERSECTED;
var UI;
var animate = false;
var t = 0;
var dir = 0.015;

//Mouse vars
var clicked;
var lastPos;

// Plugins
var controls, gui;

// Scene objects
var crate;


/********************
 * Helper Functions *
 ********************/

function getColor(cuisine_class, num_cuisines){
  var hue = cuisine_class * (255.0/parseFloat(num_cuisines));
  var lit = 50;
  var hsl_color = "hsl(" + hue + ",100%, "+ lit +"%)";
  return [new THREE.Color(hsl_color), hsl_color];
}
function populate_data(data){
  var data_points = data.split("\n");
  var dataGeometry = new THREE.Geometry();
  num_cuisines = -Infinity;

  for(var i =0; i <data_points.length; i++){
    var comps = data_points[i].split(',');
    
    var x = parseFloat(comps[0])*10;
    var y = parseFloat(comps[1])*6;
    if(comps.length==4){
      var z =0;
      var cuisine = parseInt(comps[2]);
      var ingredient = comps[3];
    }else if (comps.length==5){
      var z =parseFloat(comps[2])*10;
      var cuisine = parseInt(comps[3]);
      var ingredient = comps[4];
    }

    ingredientLabel.push({"ingredient":ingredient, "cuisine":cuisine});
    if(cuisine > num_cuisines){
      num_cuisines = cuisine;
    }
    var point = new THREE.Vector3(x,y,z);
    dataGeometry.vertices.push(point);
  }
  num_cuisines++;

  var colors = [];  
  for(var i =0; i <data_points.length; i++){
    var comps = data_points[i].split(',');
    if(comps.length==4){
      var cuisine = parseInt(comps[2]);
    }else if(comps.length ==5){
      var cuisine = parseInt(comps[3]);
    }
    colors[i] = getColor(cuisine, num_cuisines)[0];
  }
  dataGeometry.colors = colors;

  //Populate Legend:
  var legend = $("#legend-list");
  var html="";
  for(var i =0;i<num_cuisines;i++){
    var hsl_color = getColor(i,num_cuisines)[1];
    html+="<li> <div class=\"box\" style=\"background:" + hsl_color + "\"></div>" + i + "</li>"
  }
  legend.html(html);

  var pointTexture = THREE.ImageUtils.loadTexture('assets/img/texture/particle.png');
  var pointMaterial = new THREE.PointsMaterial( { map:pointTexture, size:PARTICLE_SIZE, transparent: false, alphaTest:0.5, vertexColors: THREE.VertexColors, depthTest:false });
  pointField = new THREE.Points( dataGeometry, pointMaterial );
  scene.add( pointField );
}

/***********************
 * Rendering Functions *
 ***********************/

function showUI(index){
  UI.show();
  var x = ((mouse.x+1)/2)*window.innerWidth;
  var y = -((mouse.y-1)/2)*window.innerHeight;
  UI.offset({top:y, left:x});

  var html = "";
  for(var prop in ingredientLabel[index]){
    if(ingredientLabel[index].hasOwnProperty(prop)){
      html+= "<p><b>" + prop + "</b> : " + JSON.stringify(ingredientLabel[index][prop]) + "</p>";
    }
  }
  UI.html(html);
}
function hideUI(){
  UI.hide();
}
function renderScene() {
  var geometry = pointField.geometry;
  var vertices = geometry.vertices;
  
  //console.log(geometry);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObject( pointField );
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].index ) {

      showUI(intersects[0].index);
      INTERSECTED = intersects[0].index;
    }
  } else if ( INTERSECTED !== null ) {
    INTERSECTED = null;
    hideUI();
  }

  renderer.render( scene, camera );
}


function updateScene() {
  controls.update();

  if(animate){
    var geometry = pointField.geometry;
    var vertices = geometry.vertices;

    var frameStart = parseInt(Math.floor(t) % animationData.length);
    var frameEnd = parseInt(Math.floor(t+1) % animationData.length);
    var time = t - Math.floor(t);
    for(var i =0; i <vertices.length;i++){
      vertices[i].lerpVectors(animationData[frameStart][i],animationData[frameEnd][i], time);
    }
    
    t+=dir;  
    
    geometry.verticesNeedUpdate = true;
  }

}

function animateScene() {
  window.requestAnimationFrame( animateScene );
  renderScene();
  updateScene();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  if(lastPos){
    if(lastPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY))>5){
      clicked= false;
    }
  }
  
}
function onDocumentMouseClick( event ) {
  event.preventDefault();
  if(!clicked)return;
  var mo = new THREE.Vector2();
  mo.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mo.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mo, camera);
  intersects = raycaster.intersectObject( pointField );
  if(intersects.length >0){
    scene.remove(cuisineField);
    var cur_cuisine = ingredientLabel[intersects[0].index]["cuisine"];
    var geometry = pointField.geometry;
    var vertices = geometry.vertices;

    var index_list =[];
    for(var i =0;i<ingredientLabel.length;i++){
      if(ingredientLabel[i]["cuisine"]== cur_cuisine){
        index_list.push(i);
      }
    }
    console.log("Found " + index_list.length + " other " + cur_cuisine + " cuisines");

    var cuisineGeometry = new THREE.Geometry();
    for(var i =0;i<index_list.length;i++){
      cuisineGeometry.vertices.push(vertices[index_list[i]]);
    }
    console.log(cur_cuisine);

    var pointTexture = THREE.ImageUtils.loadTexture('assets/img/texture/particle.png');
    var pointMaterial = new THREE.PointsMaterial( { map:pointTexture, size:PARTICLE_SIZE*1.50, transparent: false, alphaTest:0.5, color: getColor(cur_cuisine,num_cuisines)[1], depthTest:false });
    cuisineField = new THREE.Points( cuisineGeometry, pointMaterial );
    scene.add( cuisineField );
    pointField.material.opacity = 0.57;
  }else{
    scene.remove(cuisineField);
    pointField.material.opacity = 1.0;
  }
}
  
  


function addToDOM(object) {
  var container = document.getElementById('canvas-body');
  container.appendChild(object);
}


/************************
 * Scene Initialization *
 ************************/
function initializeScene() {

  /*************************
   * Initialize Essentials *
   *************************/

  // Scene and window resize listener
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  //scene.background = new THREE.Color( 0xFFFFFF );
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener('resize', resizeWindow, false);

  // Camera and set initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera( CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far );
  camera.position.set( CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ );
  camera.lookAt(scene.position);
  scene.add(camera);

  // Add WebGL renderer to DOM
  renderer = new THREE.WebGLRenderer(RENDERER);
  renderer.setSize(canvasWidth, canvasHeight);
  addToDOM(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );  
  $(document).click(onDocumentMouseClick);
  document.addEventListener( 'mousedown', function(event){
    clicked = true;    
    lastPos = new THREE.Vector2(event.clientX, event.clientY);
  }, false );

  /**********************
   * Initialize Plugins *
   **********************/

  // OrbitControls using mouse
  controls = new THREE.OrbitControls(camera);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);

  // Dat gui (top right controls)
  //gui = new dat.GUI( {height: 5 * 32 - 1} );


  /***************
   * Custom Code *
   ***************/

  // Example: light sources
  var lightAmbient = new THREE.AmbientLight(0x666666);
  var lightSource = new THREE.PointLight(0x888888);
  lightSource.position.set(0, 50, 80);
  scene.add(lightAmbient);
  scene.add(lightSource); 

}


/**********************
 * Render and Animate *
 **********************/
function processData(data){
  initializeScene();
  populate_data(data);
  animateScene();
}

function loadAnimationData(data){
  var data_points = data.split("\n");
 
  var frame_list =[];
  for (var j =0; j<2;j++){
    if(j==0){
      for(var i =0; i <data_points.length; i++){
        var comps = data_points[i].split(',');
        var x = parseFloat(comps[0])*10;
        var y = parseFloat(comps[1])*6;    
        var point = new THREE.Vector3(x,y,0);
        frame_list.push(point);
      }
    }
    if(j==1){
      for(var i =0; i <data_points.length; i++){
        var comps = data_points[i].split(',');
        var x = parseFloat(comps[0])*10;
        var y = parseFloat(comps[1])*6; 
        var z = parseFloat(comps[2])*10;
        
        var point = new THREE.Vector3(x,y,z);
        frame_list.push(point);
      }
    }
    animationData.push(frame_list);
    frame_list = [];
  }
  
}
$(document).ready(function() {
  UI = $("#interface");
  hideUI();
  
  $.ajax({
        type: "GET",
        url: "assets/data-tsne-2D.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

//UI interaction functions:
function load_2D_data(){
  scene.remove(pointField);
  t=0;
  $.ajax({
        type: "GET",
        url: "assets/data-tsne-2D.csv",
        dataType: "text",
        success: function(data) {populate_data(data);}
     });
}
function load_3D_data(){
  scene.remove(pointField);
  t=0;
  $.ajax({
        type: "GET",
        url: "assets/data-tsne-3D.csv",
        dataType: "text",
        success: function(data) {loadAnimationData(data);populate_data(data);}
     });
}
function toggleAnimation(){   
  animate = !animate;
}

