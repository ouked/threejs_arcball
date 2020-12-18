// ------------- ArcBall
// For three.js

"use strict";

/**
 * ArcBall Camera Controller
 * @param camera Three.js camera to control
 * @param messageHandler Function to display messages
 * @constructor
 */
let ArcBall = function (camera, messageHandler=null) {
    /**
     * Scalar to move camera by in ArcBall mode
     * @type {number}
     */
    const arcBallScale = 0.002;

    /**
     * Scalar for moving camera in Pan mode
     * @type {number}
     */
    const panScale = 0.01;

    /**
     * Scalar for zooming camera
     * @type {number}
     */
    const zoomScale = 0.01;

    /**
     * Scalar for touch input
     * @type {number}
     */
    const touchMultiplier = 5.0;

    /**
     * Display plane to the user
     * @type {boolean}
     */
    const displayPlaneHelper = false;

    /**
     * Object to store details about mouse
     * @type {{pos: Vector2, down: boolean}}
     */
    let mouse = {
        pos: new THREE.Vector2(),
        down: false,
    };

    // If no messageHandler is given, ignore messages.
    if (messageHandler === null) {
        messageHandler = () => {return true};
    }

    /**
     * Point the camera is looking at
     */
    let lookAtPoint;

    /**
     * Minimum radius to zoom to
     * @type {number}
     */
    const minRadius = 1;

    /**
     * Plane for the camera to raycast to
     * @type {Plane}
     */
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));

    // Display plane?
    if (displayPlaneHelper) {
        const planeHelper = new THREE.PlaneHelper(plane, 10000);
        scene.add(planeHelper);
    }

    /**
     * Updates lookAtPoint to either what the camera is looking at or 0,0,0 if the camera is under the
     */
    const updateLookAtPoint = function () {
        const raycaster = new THREE.Raycaster();
        raycaster.set(camera.getWorldPosition(), camera.getWorldDirection());
        const intersection = raycaster.ray.intersectPlane(plane);
        if (intersection == null) {
            camera.lookAt(lookAtPoint);
            messageHandler("Moved camera due to invalid look-at point!");
        } else {
            lookAtPoint = intersection
        }
        return lookAtPoint;
    };
    updateLookAtPoint();

    /**
     * Move camera in arc mode
     * @param deltaX Distance the mouse has moved in x-direction since last update
     * @param deltaY Distance the mouse has moved in y-direction since last update
     */
    const moveCameraArc = function (deltaX, deltaY) {
        camera.position.sub(lookAtPoint);

        const x = camera.position.x;
        const y = camera.position.y;
        const z = camera.position.z;

        const radius = camera.position.length();
        let theta = Math.atan2(x, z); // equator angle around y-up axis
        let phi = Math.acos(Math.min(Math.max(y / radius, -1), 1)); // polar angle

        phi += deltaY;
        theta += deltaX;

        camera.position.set(
            (radius * Math.sin(phi) * Math.sin(theta)),
            (radius * Math.cos(phi)),
            (radius * Math.sin(phi) * Math.cos(theta))
        );

        camera.position.add(lookAtPoint);

        // Rotate camera to look at target
        camera.lookAt(lookAtPoint);
    };

    /**
     * Move camera in pan mode
     * @param deltaX Distance the mouse has moved in x-direction since last update
     * @param deltaY Distance the mouse has moved in y-direction since last update
     */
    const moveCameraPan = function (deltaX, deltaY) {
        camera.translateX(deltaX);
        camera.translateY(-deltaY);

        updateLookAtPoint();
    };

    //region Mouse Events
    /**
     * Mouse down event handler
     * @param e Event
     */
    const onMouseDown = function (e) {
        mouse.pos = new THREE.Vector2(e.offsetX, e.offsetY);
        mouse.down = true;
        updateLookAtPoint();
    };

    /**
     * Mouse up event handler
     */
    const onMouseUp = function () {
        mouse.down = false;
    };

    /**
     * Mouse movement handler
     * @param e Event
     */
    const onMouseMove = function (e) {
        e.preventDefault();
        if (!mouse.down) return;
        const deltaX = (mouse.pos.x - e.offsetX);
        const deltaY = (mouse.pos.y - e.offsetY);
        if (e.shiftKey) {
            moveCameraPan(deltaX * panScale, deltaY * panScale);
        } else {

            moveCameraArc(deltaX * arcBallScale, deltaY * arcBallScale);
        }
        // Get how far mouse has travelled (and scale)

        // Update mouse coords
        mouse.pos.x = e.offsetX;
        mouse.pos.y = e.offsetY;

    };

    /**
     * Wheel handler
     * @param e Event handler
     */
    const onWheel = function (e) {
        e.preventDefault();
        if (mouse.down) return;
        const deltaZ = e.deltaY * zoomScale;
        if (camera.position.distanceTo(lookAtPoint) + deltaZ > minRadius) {
            camera.translateZ(deltaZ);
        } else {
            messageHandler("Minimum zoom radius reached!")
        }
    };

    /**
     * Touch start handler
     * @param e Event
     */
    const touchStart = function(e) {
        const touch = e.touches[0];
        mouse.pos = new THREE.Vector2(touch.pageX, touch.pageY);
        mouse.down = true;
    };

    /**
     * Touch end handler
     * @param e Event
     */
    const touchEnd = function(e) {
        mouse.pos = new THREE.Vector2(e.offsetX, e.offsetY);
        mouse.down = false;
    };

    /**
     * Touch move handler
     * @param e Event
     */
    const touchMove = function(e) {
        const touch = e.touches[0];
        const deltaX = (mouse.pos.x - touch.pageX);
        const deltaY = (mouse.pos.y - touch.pageY);
        console.log(touch);
        moveCameraArc(deltaX * arcBallScale * touchMultiplier, deltaY * arcBallScale * touchMultiplier);
        // Update mouse coords
        mouse.pos = new THREE.Vector2(touch.pageX, touch.pageY);
    };
    //endregion

    //region Event Listeners
    // Subscribe to events
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchstart', touchStart);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', touchEnd);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', touchMove);
    document.addEventListener('wheel', onWheel);
    //endregion

};



