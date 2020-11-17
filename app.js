"use strict"; // https://stackoverflow.com/q/1335851/72470

// Global variables that are available in all functions.
// Note: You can add your own here, e.g. to store the rendering mode.
let camera, scene, renderer, mesh, cube, line, controls, floor;

let rotate = {
    x: false,
    y: false,
    z: false
};

let cameraMove = {
    up: false,
    down: false,
    left: false,
    right: false,
    forward: false,
    backward: false
};
const rotationSpeed = 0.01;
const cameraSpeed = 0.1;
const githubURL = "http://github.com/ouked/FoVC_Coursework/";
// Initialise the scene, and draw it for the first time.


let messageTimeout;
const showMessage = function(message, duration) {

    if (duration === undefined) {
        duration = 2500;
    }
    const hud = document.getElementById("hud");
    hud.innerHTML = message;
    hud.classList.remove("hidden");
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(function()
    {
        hud.classList.add("hidden");
    }, duration);
};

const showHelp = function() {

    const helpText = "Orbit - MOUSE<br>Pan - SHIFT+MOUSE<br>Zoom - SCROLL<br>Fly - ARROWS, [Q], [A]<br>Reset camera - [0]<br>Rotate cube - [X], [Y], [Z]<br>Render modes - [V], [E], [F]<br><br>Help - [H]<br>"+
    "<br>Open GitHub - [G]";
    showMessage(helpText, 15000);
};


init();
animate();

// Scene initialisation. This function is only run once, at the very beginning.
function init()
{
    scene = new THREE.Scene();

    // Set up the camera, move it to (3, 4, 5) and look at the origin (0, 0, 0).
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 4, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    new ArcBall(camera, showMessage);

    // Draw a helper grid in the x-z plane (note: y is up).
    const floor = new THREE.GridHelper(10, 20, 0xffffff);
    scene.add(floor);


    //region cube
    // TO DO: Draw a cube (requirement 1).
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const materials = [
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/blue.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/green.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/red.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/orange.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/white.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/rubiks/yellow.jpg')}),
    ];
    cube = new THREE.Mesh( geometry, materials );
    scene.add(cube);
    //endregion


    //region skybox
    const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
    // Textures taken from:
    // http://wwwtyro.github.io/space-3d/#animationSpeed=1&fov=80&nebulae=true&pointStars=true&resolution=1024&seed=romane&stars=true
    const skyboxMaterials = [
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/right.png'),  side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/left.png'),   side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/top.png'),    side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/bottom.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/front.png'),  side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/back.png'),   side: THREE.BackSide}),
    ];
    let skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterials );
    scene.add(skybox);
    //endregion


    const edges = new THREE.EdgesGeometry( geometry );
    line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

    // TO DO: Visualise the axes of the global coordinate system (requirement 2).
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    // Basic ambient lighting.
    scene.add(new THREE.AmbientLight(0xffffff));
    // TO DO: add more complex lighting for 'face' rendering mode (requirement 4).

    // Set up the Web GL renderer.
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Handle resizing of the browser window.
    window.addEventListener('resize', handleResize, false);


    showMessage("Press [H] for help.", 5000)
}

// Handle resizing of the browser window.
function handleResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop function. This function is called whenever an update is required.
function animate()
{
    requestAnimationFrame(animate);

    // TO DO: This is a good place for code that rotates your cube (requirement 3).
    for (const dimension in rotate){
        if (rotate.hasOwnProperty(dimension) && rotate[dimension] === true) {
            cube.rotation[dimension] -= rotationSpeed;
            line.rotation[dimension] -= rotationSpeed;
        }
    }

    moveCamera();
    // Render the current scene to the screen.
    renderer.render(scene, camera);
}

function moveCamera() {
    if (cameraMove.forward)     camera.translateZ( -cameraSpeed );
    if (cameraMove.backward)    camera.translateZ( cameraSpeed );

    if (cameraMove.left)        camera.translateX( -cameraSpeed );
    if (cameraMove.right)       camera.translateX( cameraSpeed );

    if (cameraMove.up)          camera.translateY( cameraSpeed );
    if (cameraMove.down)        camera.translateY( -cameraSpeed );
}
