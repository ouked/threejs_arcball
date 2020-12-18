"use strict"; // https://stackoverflow.com/q/1335851/72470
// Global variables that are available in all functions.
let camera, scene, renderer, mesh, cube, line, controls, floor, directionalLight, points, peterEdges, peterPoints,
    peter;

/**
 * Object to control rotation of cube and bunny
 * @type {{x: boolean, y: boolean, z: boolean}}
 */
let rotate = {
    x: false,
    y: false,
    z: false
};

/**
 * Object to control direction of camera moving
 * @type {{left: boolean, forward: boolean, backward: boolean, up: boolean, right: boolean, down: boolean}}
 */
let cameraMove = {
    up: false,
    down: false,
    left: false,
    right: false,
    forward: false,
    backward: false
};
/**
 * Speed to rotate cube and bunny
 * @type {number}
 */
const rotationSpeed = 0.01;
/**
 * Speed to move camera
 * @type {number}
 */
const cameraSpeed = 0.1;
/**
 * Link to GitHub repo
 * @type {string}
 */
const githubURL = "https://ouked.github.io/threeJS-demo/";
// Initialise the scene, and draw it for the first time.

/**
 * Timeout callback to show message
 */
let messageTimeout;
/**
 * Displays message to user using HTML DOM
 * @param message Message to display
 * @param duration Duration to display message
 */
const showMessage = function (message, duration) {
    // Default message duration
    if (duration === undefined) {duration = 2500;}

    // DOM element to show message to
    const hud = document.getElementById("hud");
    // Change text to message, show, wait duration, and then hide
    hud.innerHTML = message;
    hud.classList.remove("hidden");
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(function () {
        hud.classList.add("hidden");
    }, duration);
};

/**
 * Display help message to user
 */
const showHelp = function () {

    const helpText = "Orbit - MOUSE<br>Pan - SHIFT+MOUSE<br>Zoom - SCROLL<br>Fly - ARROWS, [Q], [A]<br>Reset camera - [0]<br>Rotate cube - [X], [Y], [Z]<br>Cube render modes - [V], [E], [F]<br>Peter render modes - [J], [K], [L]<br><br>Help - [H]<br>" +
        "<br>Open GitHub - [G]";
    showMessage(helpText, 15000);
};


init();
animate();

/**
 * Initialise project
 */
function init() {
    /**
     * Main scene
     * @type {Scene}
     */
    scene = new THREE.Scene();

    /**
     * Main Camera
     * @type {PerspectiveCamera}
     */
    // Set up the camera, move it to (3, 4, 5) and look at the origin (0, 0, 0).
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 4, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Start ArcBall control
    new ArcBall(camera, showMessage);

    // Draw a helper grid in the x-z plane (note: y is up).
    const floor = new THREE.GridHelper(10, 20, 0xffffff);
    scene.add(floor);


    //region cube
    // Draws cube to scene
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/blue.jpg')}),
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/green.jpg')}),
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/red.jpg')}),
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/orange.jpg')}),
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/white.jpg')}),
        new THREE.MeshPhongMaterial({map: loader.load('res/rubiks/yellow.jpg')}),
    ];

    line = new THREE.Line(geometry, new THREE.PointsMaterial({color: 0xff66ed, size: 0.2}));

    cube = new THREE.Mesh(geometry, materials);
    points = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xff66ed, size: 0.1}));
    scene.add(cube);
    //endregion


    //region skybox
    // Skybox, to make the cube appear as if it was in space
    const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
    // Textures taken from:
    // http://wwwtyro.github.io/space-3d/#animationSpeed=1&fov=80&nebulae=true&pointStars=true&resolution=1024&seed=romane&stars=true
    const skyboxMaterials = [
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/right.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/left.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/top.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/bottom.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/front.png'), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: loader.load('res/skybox/back.png'), side: THREE.BackSide}),
    ];
    let skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    scene.add(skybox);
    //endregion

    // TO DO: Visualise the axes of the global coordinate system (requirement 2).
    // Visualise the X, Y, Z axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Instantiate
    let objLoader = new THREE.OBJLoader();

    objLoader.load(
        'res/models/bunny-5000.obj',
        function (object) {
            let peterGeometry = object.children[0].geometry;
            peterGeometry.scale(0.48, 0.48, 0.48);
            peterGeometry.translate(-0.5, 0.01, 0);

            peter = new THREE.Mesh(peterGeometry, new THREE.MeshBasicMaterial({color: 0x14f7ff}));
            peter.name = "Peter";
            scene.add(peter);

            peterEdges = new THREE.LineSegments(
                new THREE.EdgesGeometry(peterGeometry),
                new THREE.LineBasicMaterial({color: 0x14f7ff})
            );
            // scene.add(peterEdges);

            peterPoints = new THREE.Points(peterGeometry, new THREE.PointsMaterial({color: 0x14f7ff, size: 0.01}));
            // scene.add(peterPoints);
        }
    );


    // Basic ambient lighting.
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    // Rotating light to light the faces up
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);
    directionalLight.position.set(7, 0, 7);

    // Set up the Web GL renderer.
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Handle resizing of the browser window.
    window.addEventListener('resize', handleResize, false);

    // Display prompt for help
    showMessage("Press [H] for help.", 5000)
}

/**
 * Handle resizing of the browser window.
 */
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);

    // TO DO: This is a good place for code that rotates your cube (requirement 3).
    for (const dimension in rotate) {
        if (rotate.hasOwnProperty(dimension) && rotate[dimension] === true) {
            // Rotate cube in dimension
            cube.rotation[dimension] -= rotationSpeed;
            points.rotation[dimension] -= rotationSpeed;
            line.rotation[dimension] -= rotationSpeed;

            // Rotate bunny in dimension, in opposite direction
            peter.rotation[dimension] += rotationSpeed;
            peterPoints.rotation[dimension] += rotationSpeed;
            peterEdges.rotation[dimension] += rotationSpeed;
        }
    }

    // Rotate directional light
    let lightCoords = new THREE.Spherical().setFromVector3(directionalLight.position);
    lightCoords.theta += 0.02;
    const v3 = new THREE.Vector3().setFromSpherical(lightCoords);
    directionalLight.position.set(v3.x, v3.y, v3.z);

    // Apply camera movements
    moveCamera();

    // Render the current scene to the screen.
    renderer.render(scene, camera);
}

/**
 * Translate camera
 */
function moveCamera() {
    // Translate camera
    if (cameraMove.forward) camera.translateZ(-cameraSpeed);
    if (cameraMove.backward) camera.translateZ(cameraSpeed);

    if (cameraMove.left) camera.translateX(-cameraSpeed);
    if (cameraMove.right) camera.translateX(cameraSpeed);

    if (cameraMove.up) camera.translateY(cameraSpeed);
    if (cameraMove.down) camera.translateY(-cameraSpeed);
}
