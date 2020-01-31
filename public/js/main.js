import * as THREE from '../three.js-r112/build/three.module.js';
import { StereoEffect } from '../three.js-r112/examples/jsm/effects/StereoEffect.js';
import { FirstPersonControls } from '../three.js-r112/examples/jsm/controls/FirstPersonControls.js';
import { DeviceOrientationControls } from '../three.js-r112/examples/jsm/controls/DeviceOrientationControls.js';
import Grave from './_grave.js'
import Stats from './libs/Stats.js';


window.md = new MobileDetect(window.navigator.userAgent);
window.shuffled = [];
window.shuffledIndex = 780;
window.imgFolder = "https://api.autr.tv/uploads/_/originals/ddd/";

const getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


while (shuffled.length < websites.length) {
  var randIndex = parseInt((Math.random() * websites.length), 10);
  if (shuffled.indexOf(randIndex) === -1) {
    shuffled.push(randIndex);
  }
}

function degToRadian(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

const params = getUrlVars();
let VR = false;

var scene, camera, renderer, light, gui, clock, spotlightGui, lightHelper, torch, source, dest, floor, sampler, solution, godCamera, godControls, controls, graves, models, areaSize, manager, sprite, w, h, stereoEffect;
var projector, mouse = { x: 0, y: 0 }, INTERSECTED, vector, ray;


var shadow = 1;
var blockColour = 0x999999;
var floorColour = 0xaaaaaa;
var ambientColour = 0xaaaaaa;

window.message;

function guiChange() {
  scene.fog.density = gui.fogDensity;
  godCamera.left = gui.l;
  godCamera.right = gui.r;
  godCamera.top = gui.t;
  godCamera.bottom = gui.b;
  godCamera.position.x = gui.x;
  godCamera.position.y = gui.y;
  godCamera.position.z = gui.z;
  godCamera.lookAt( scene.position );
  godCamera.updateProjectionMatrix();
}

function de2ra(degree) { return degree*(Math.PI/180); } 

function spotlightChange() {
  light.intensity = spotlightGui.intensity;
  light.distance = spotlightGui.distance;
  light.angle = spotlightGui.angle;
  light.penumbra = spotlightGui.penumbra;
  light.decay = spotlightGui.decay;
  light.position.x = spotlightGui.x;
  light.position.y = spotlightGui.y;
  light.position.z = spotlightGui.z;
  //lightHelper.update();
}


  // var startButton = document.getElementById( 'startButton' );
  // startButton.addEventListener( 'click', function () {

  //   init();
  //   animate();

  // }, false );

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}



const onKeyDown = function ( event ) {


  //event.preventDefault();

  if (!controlsInited) {
    $('#ctrlU').trigger('click');
  }


  if (isMobile()) {
    if (event.key === 'a') startEvent('actionForward');
    if (event.key === 'd') startEvent('actionBackward');
    return;
  }

  switch ( event.keyCode ) {

    case 38: /*up*/
    case 87: /*W*/ startEvent('actionForward'); break;

    case 37: /*left*/
    case 65: /*A*/ startEvent('actionLeft'); break;

    case 40: /*down*/
    case 83: /*S*/ startEvent('actionBackward'); break;

    case 39: /*right*/
    case 68: /*D*/ startEvent('actionRight'); break;

    case 81: /*R*/ startEvent('actionUp'); break;
    case 69: /*F*/ startEvent('actionDown'); break;

  }

};

const onKeyUp = function ( event ) {

  if (isMobile()) {
    if (event.key === 'a') stopEvent('actionForward');
    if (event.key === 'd') stopEvent('actionBackward');
    return;
  }
  switch ( event.keyCode ) {

    case 38: /*up*/
    case 87: /*W*/ stopEvent('actionForward'); break;

    case 37: /*left*/
    case 65: /*A*/ stopEvent('actionLeft'); break;

    case 40: /*down*/
    case 83: /*S*/ stopEvent('actionBackward'); break;

    case 39: /*right*/
    case 68: /*D*/ stopEvent('actionRight'); break;

    case 81: /*R*/ stopEvent('actionUp'); break;
    case 69: /*F*/ stopEvent('actionDown'); break;

  }

};


const startEvent = (k) => {
  // console.log('do', k);

  const btn = $(`button[data-action='${k}']`)[0];
  if (btn) {
    btn.classList.add('active');
  }


  if (!controlsInited) return;

  if (k === 'actionForward') controls.moveForward = true;
  if (k === 'actionLeft') controls.moveLeft= true;
  if (k === 'actionRight') controls.moveRight = true;
  if (k === 'actionBackward') controls.moveBackward = true;
  if (k === 'actionUp') controls.moveUp = true;
  if (k === 'actionDown') controls.moveDown = true;

};
const stopEvent = (k) => {
  // console.log('stop', k);
  const btn = $(`button[data-action='${k}']`)[0];
  if (btn) {
    btn.classList.remove('active');
  }


  if (!controlsInited) return;

  if (k === 'actionForward') controls.moveForward = false;
  if (k === 'actionLeft') controls.moveLeft= false;
  if (k === 'actionRight') controls.moveRight = false;
  if (k === 'actionBackward') controls.moveBackward = false;
  if (k === 'actionUp') controls.moveUp = false;
  if (k === 'actionDown') controls.moveDown = false;
};

let info = false;

window.addEventListener("gamepadconnected", (e) => {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length);
  e.gamepad.buttons.forEach( (b) => {
    console.log('button', b)
  })
  e.gamepad.axes.forEach( (a) => {
    console.log('axis', a)
  })
});


window.onload = function () { 

  console.log('gamepads', navigator.getGamepads());

  window.message = $('#message')[0];
  init();

  $(window).on('resize orientationchange', function(e) {
      w = window.innerWidth;
      h = window.innerHeight;
      const border = 20;
      renderer.setSize(w - border, h - border);
      stereoEffect.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // setTimeout( () => {
        $('canvas').css( {width: w - border, height: h - border});
        $('#main').css( {width: w, height: h});
      // }, 100);
    });

  $(window).trigger('resize');

  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );


  const isInside = (e, target) => {
      const r = target.getBoundingClientRect();
     if (e.pageX >= r.x && e.pageX <= (r.x + r.width) &&
      e.pageY >= r.y && e.pageY <= (r.y + r.height) ) {
      return true;
    }
    return false;
  };


  const toggleInfo = () => {
      if (!info) $('body').addClass("info");
      if (info) $('body').removeClass("info");
      info = !info;
  }

  const toggleVR = () => {

      if (!VR) $('body').addClass("vr");
      if (VR) $('body').removeClass("vr");
      setTimeout( () => {
        VR = !VR;
        $(window).trigger('resize');
      }, (!VR) ? 400 : 0);
  }


  if (params) if (params.mode) if (params.mode.toLowerCase() === 'vr') toggleVR();

  $('button').click( (e) => {

    if (e.currentTarget.id === 'ctrlVR') toggleVR();
    if (e.currentTarget.id === 'ctrlInfo') toggleInfo();
    if (!controlsInited) {

      //////// CONTROLS


      if (!isMobile()) {

        controls = new FirstPersonControls( camera , renderer.domElement);
        controls.activeLook = true;
        controls.autoForward =  false;
        controls.lookVertical = true;
        controls.lookHorizontal = true;
        controls.constrainVertical = true;
        controls.verticalMin = 0.8;
        controls.verticalMax = 2.2;
        controls.lookSpeed = 0.1;


      } else {
        controls = new DeviceOrientationControls( camera, renderer.domElement );

      }

      controls.movementSpeed = 8;
      controlsInited = true;
    }
  });

  $('button').bind('mousedown mouseenter', (e, t) => {


    if (e.type === 'mouseenter' && mouseDown === 0) return;
    const k = e.currentTarget.getAttribute('data-action');
    startEvent(k);
  }).bind('mouseleave mouseup', (e, t) => {


    if (e.type === 'mouseleave' && mouseDown === 0) return;
    const k = e.currentTarget.getAttribute('data-action');
    stopEvent(k);

  });
  const btns = document.querySelectorAll('button');
  $(document).bind('touchstart touchmove touchend', (e, t) => {


    if (VR) {
      if (e.type === 'touchstart') controls.moveForward = true;
      if (e.type === 'touchend') controls.moveForward = false;
    }
    btns.forEach( (el, i) => {
      const inside = isInside(e.originalEvent, el);
      const hasClass =  $(el).hasClass('active');
      const k = el.getAttribute('data-action');
      if (!inside && hasClass) {
        stopEvent(k);
      }
      if (inside && !hasClass) {
        startEvent(k);
      }
      if (inside && hasClass && e.type === 'touchend') {
        stopEvent(k);
      }
    });
  });

};


const isMobile = () => {
  return ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' );
}

const isVR = () => {
  return VR;
}

const showStats = false;


function init() {

  if (showStats) {

    window.stats = new Stats();
    window.stats.showPanel( 1 );

    document.body.appendChild( window.stats.dom );

  }


  w = window.innerWidth - 20, h = window.innerHeight - 20;
  // w = 800;
  // h = 600;

  areaSize = 200;


  // var progressBar = document.createElement('div');
  // progressBar.classList.add('progressBar');
  // document.body.appendChild(progressBar);
  manager = new THREE.LoadingManager();

  /////// CLOCK

  clock = new THREE.Clock();

  /////// GUI

  gui  = {
    fogDensity: 0.02,
    l: (areaSize*4) / - 2,
    r: (areaSize*4) / 2,
    t: (areaSize*4) / 2,
    b: (areaSize*4) / - 2,
    x: 0,
    y: 8,
    z: 8,
  };

  spotlightGui = {
    intensity: 3,
    distance: 200,
    angle: 1,
    penumbra: 1,
    decay: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  var lightDist = 100.0;

  var datGui = new dat.GUI();


  datGui.add( gui, "fogDensity", 0, 0.1 ).onChange( guiChange );
  datGui.add( gui, "l").onChange( guiChange );
  datGui.add( gui, "r").onChange( guiChange );
  datGui.add( gui, "t").onChange( guiChange );
  datGui.add( gui, "b").onChange( guiChange );
  datGui.add( gui, "x", -100, 100).onChange( guiChange );
  datGui.add( gui, "y", -100, 100).onChange( guiChange );
  datGui.add( gui, "z", -100, 100).onChange( guiChange );

  datGui.add( spotlightGui, "intensity", 0, 3 ).onChange( spotlightChange );
  datGui.add( spotlightGui, "distance", 0, 200 ).onChange( spotlightChange );
  datGui.add( spotlightGui, "angle", 0, 10 ).onChange( spotlightChange );
  datGui.add( spotlightGui, "penumbra", 0, 1 ).onChange( spotlightChange );
  datGui.add( spotlightGui, "decay", 0, 2 ).onChange( spotlightChange );
  datGui.add( spotlightGui, "x", -lightDist, lightDist ).onChange( spotlightChange );
  datGui.add( spotlightGui, "z", -lightDist, lightDist ).onChange( spotlightChange );
  datGui.add( spotlightGui, "y", -lightDist, lightDist ).onChange( spotlightChange );

  datGui.close();
  dat.GUI.toggleHide();

  /////// SCENE

  scene = new THREE.Scene();

  

  scene.fog = new THREE.FogExp2( 0xffffff, gui.fogDensity );

  //////// RENDERER

  var canvas = $('canvas.3d');
  renderer = new THREE.WebGLRenderer({antialias:true, canvas: canvas[0]});
  renderer.setSize(w, h);
  if (shadow) renderer.shadowMap.enabled = true;
  if (shadow) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.xr.enabled = true;

  //////// STEREOSCOPIC

  stereoEffect = new StereoEffect(renderer);


  //////// LIGHT

  renderer.setClearColor(new THREE.Color(255, 255,255), 1);

  light = new THREE.SpotLight(0xffffff);
  if (shadow) light.castShadow = true;
  // light.shadowDarkness = 0.05;
  light.position.set(spotlightGui.x,spotlightGui.y,spotlightGui.z);
  light.shadow.mapSize.width = 1024 * 1;
  light.shadow.mapSize.height = 1024 * 1;
  light.position.x = 0;
  light.position.y = 0;
  light.position.z = 0;
  //scene.add(light);

  var ambient = new THREE.AmbientLight( ambientColour );
  scene.add(ambient);




  ///////// OBJECTS



  sampler = new PoissonDiskSampler(areaSize - 10, areaSize - 10, 20, 30 );
  solution = sampler.sampleUntilSolution();


  // for ( var i = 0; i < solution.length; i ++ ) {

  ////// STONE

  graves = [];
  models = [];

  var count = 0;

  function nextTombstone() {

    var x = solution[count].x - (areaSize/2);
    var z = solution[count].y - (areaSize/2);

    var grave = new Grave();


    grave.init(x, z, scene).then( () => {

      // console.log('loaded', grave.website.url);
      graves.push(grave);
      models.push(grave.model);
      count += 1;
      $('.loading').text("loading initial " + count + "/"+ solution.length);
      if (count < solution.length) nextTombstone();
    }).catch( err => {
      console.error('error', err);
    });


    
  }

  nextTombstone();


var nCells = 8;
      var geometry = new THREE.PlaneGeometry(50,50,nCells,nCells);

geometry.faces.forEach( (face, idx) => {
  if ( (idx + (Math.floor(idx/(nCells*2)) % 2 * 2)) % 4 < 2 ) {
    face.color.setRGB(0,1,1);
  }
});

var material = new THREE.MeshBasicMaterial( {color: 0xffffff, vertexColors: THREE.FaceColors} );
// ---
// generated by coffee-script 1.9.2


  ////////// FLOOR

  floor = new THREE.Mesh( 
    new THREE.BoxGeometry( areaSize * 2, areaSize * 2, 1, 1 ), 
    new THREE.MeshPhongMaterial( { color: floorColour } ));
  floor.material.side = THREE.DoubleSide;
  floor.rotation.x = de2ra(90);
  floor.position.y = 0;
  if (shadow) floor.receiveShadow = true;
  scene.add( floor );

      // var plane = new THREE.Mesh( geometry, material );
      // scene.add( plane );

  /////// CAMERA



  source = new THREE.Mesh(new THREE.BoxGeometry( 2, 2, 2), new THREE.MeshPhongMaterial( { 
      color: 0x00ffff,
  } ) );
  source.position.x = 0;
  source.position.y = 20;
  source.position.z = 20;

  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 20000);
  scene.add(camera);
  camera.add(source);
  source.add(light);
  light.target = camera;

  camera.position.y = 6;
  var vector = new THREE.Vector3( 10, camera.position.y, 0 );
  camera.lookAt ( vector );

  // godCamera = new THREE.OrthographicCamera(gui.l, gui.r , gui.t , gui.b , -2000, 2000 );
  // godCamera.position.x = gui.x;
  // godCamera.position.y = gui.y;
  // godCamera.position.z = gui.z;
  // godCamera.lookAt( scene.position );
  // scene.add(godCamera);

  /////// MOUSE


  // projector = new THREE.Raycaster();
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'touchstart', onDocumentMouseDown, false );

  // window.addEventListener('keydown', (e) => {

  //   console.log('keydown', e.key);

  // }, false);
  // window.addEventListener('keyup', (e) => {

  //   console.log('keyup', e.key);

  // }, false);

  //////// RAYS


  vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  vector.unproject(camera );
  ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  renderer.setAnimationLoop( animate );



} // end init

let controlsInited = false;

const buttonPressed = ( b ) => {
  return true;
}

const gamepadLoop = () => {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) return;

  var gp = gamepads[0];
  if (!gp) return;

  if (buttonPressed(gp.buttons[0])) {
    console.log('b 0')
  }
  if (buttonPressed(gp.buttons[1])) {
    
    console.log('b 1')
  }
  if (buttonPressed(gp.buttons[2])) {
    
    console.log('b 2')
  }
  if (buttonPressed(gp.buttons[3])) {
    
    console.log('b 3')
  }
}

function animate() {
  gamepadLoop();
  TWEEN.update();
  if (showStats) window.stats.begin();



  for ( var i = 0; i < graves.length - 1; i ++ ) {
    var grave = graves[i];
    var model = grave.model;
    var graveZ = model.position.z;
    var cameraZ = camera.position.z;
    var graveX = model.position.x;
    var cameraX = camera.position.x;
    var updateTexture = false;
    if ((graveZ - cameraZ) > (areaSize/2)) { model.position.z -= areaSize; updateTexture = true; }
    if ((graveZ - cameraZ) < ((areaSize/2)*-1)) { model.position.z += areaSize; updateTexture = true; }
    if ((graveX - cameraX) > (areaSize/2)) { model.position.x -= areaSize; updateTexture = true; }
    if ((graveX - cameraX) < ((areaSize/2)*-1)) { model.position.x += areaSize; updateTexture = true; }
    if (updateTexture) grave.texturise();
  }


  // requestAnimationFrame(animate);

  ///// MOVE FLOOR

  floor.position.x = camera.position.x;
  floor.position.z = camera.position.z;

  if (controlsInited) controls.update( clock.getDelta() );


  camera.updateProjectionMatrix();
  const minFloor = 1;
  if ( camera.position.y < minFloor ) camera.position.y = minFloor;

  if (!VR) renderer.render(scene, camera);
  if (VR) stereoEffect.render(scene, camera);

  if (showStats) window.stats.end();



}

function onDocumentMouseMove( event ) {
}

var closeup = false;

function onDocumentMouseDown( event ) {


}
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

  