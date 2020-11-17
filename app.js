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
// Initialise the scene, and draw it for the first time.
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

    new ArcBall(camera);

    // Draw a helper grid in the x-z plane (note: y is up).
    const floor = new THREE.GridHelper(10, 20, 0xffffff);
    scene.add(floor);

    // TO DO: Draw a cube (requirement 1).
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const materials = [
        new THREE.MeshBasicMaterial({map: loader.load('res/blue.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/green.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/red.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/orange.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/white.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('res/yellow.jpg')}),
    ];
    cube = new THREE.Mesh( geometry, materials );
    scene.add(cube);

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


// Listen for keyboard events, to react to them.
// Note: there are also other event listeners, e.g. for mouse events.
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Handle keyboard presses.
function handleKeyDown(event)
{
    switch (event.keyCode)
    {
        // Render modes.
        case 70: // f = face
            scene.remove(line);
            scene.add(cube);
            cube.material.wireframe = false;
            break;

        case 69: // e = edge
            scene.remove(line);
            scene.add(cube);
            cube.material.wireframe = true;
            break;

        case 86: // v = vertex
            scene.remove(cube);
            scene.add( line );
            break;

        // TO DO: add code for starting/stopping rotations (requirement 3).
        // Cube Rotation
        case 88: // x = rotate cube in X
            rotate.x = !rotate.x;
            break;
        case 89: // y = rotate cube in y
            rotate.y = !rotate.y;
            break;
        case 90: // z = rotate cube in z
            rotate.z = !rotate.z;
            break;

        // Camera Movement
        case 65: // a = down
            cameraMove.down = true;
            break;
        case 81: // q = up
            cameraMove.up = true;
            break;
        case 37: // left
            cameraMove.left = true;
            break;
        case 38: // forward
            cameraMove.forward = true;
            break;
        case 39: // right
            cameraMove.right = true;
            break;
        case 40: // back
            cameraMove.backward = true;
            break;
    }
}

function handleKeyUp(event) {
    switch(event.keyCode) {
        // Camera Movement
        case 65: // a = down
            cameraMove.down = false;
            break;
        case 81: // q = up
            cameraMove.up = false;
            break;
        case 37: // left
            cameraMove.left = false;
            break;
        case 38: // forward
            cameraMove.forward = false;
            break;
        case 39: // right
            cameraMove.right = false;
            break;
        case 40: // back
            cameraMove.backward = false;
            break;
    }
}
