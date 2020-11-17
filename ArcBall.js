// Alex Dawkins ArcBall
// For three.js

"use strict";

let ArcBall = function (camera, messageHandler) {
    // Scalar for moving camera in Arc Ball mode
    const arcBallScale = 0.002;

    // Scalar for moving camera in Pan mode
    const panScale = 0.01;

    // Scalar for zooming camera
    const zoomScale = 0.01;

    // Display plane helper?
    const displayPlaneHelper = false;

    // Store values about mouse
    let mouse = {
        pos: new THREE.Vector2(),
        down: false,
    };

    // Point that the camera is looking at
    let lookAtPoint;

    // Minimum radius to zoom to
    const minRadius = 1;

    // Home plane to raycast to.
    const plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ) );

    // Display plane?
    if (displayPlaneHelper) {
        const planeHelper = new THREE.PlaneHelper(plane, 10000);
        scene.add(planeHelper);
    }

    /**
     * Updates lookAtPoint to either what the camera is looking at or 0,0,0 if the camera is under the
     */
    const updateLookAtPoint = function() {
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

    const moveCameraArc = function(deltaX, deltaY) {
        camera.position.sub(lookAtPoint);

        const x = camera.position.x;
        const y = camera.position.y;
        const z = camera.position.z;

        const radius = camera.position.length();
        let theta = Math.atan2(x, z ); // equator angle around y-up axis
        let phi = Math.acos( Math.min(Math.max( y / radius, - 1), 1 )); // polar angle

        phi += deltaY;
        theta += deltaX;

        camera.position.set(
            (radius * Math.sin( phi ) * Math.sin( theta )),
            (radius * Math.cos( phi )),
            (radius * Math.sin( phi ) * Math.cos( theta ))
        );

        camera.position.add(lookAtPoint);

        // Rotate camera to look at target
        camera.lookAt(lookAtPoint);
    };

    const moveCameraPan = function(deltaX, deltaY) {
        camera.translateX(deltaX);
        camera.translateY(-deltaY);

        updateLookAtPoint();
    };

    //region Mouse Events
    const onMouseDown = function(e) {
        mouse.pos = new THREE.Vector2(e.offsetX, e.offsetY);
        mouse.down = true;
        updateLookAtPoint();
    };

    const onMouseUp = function() { mouse.down = false; };

    const onMouseMove = function (e) {
        e.preventDefault();
        if (!mouse.down) return;
        const deltaX = (mouse.pos.x - e.offsetX);
        const deltaY = (mouse.pos.y - e.offsetY);
        if (e.shiftKey) {
            moveCameraPan(deltaX*panScale, deltaY*panScale);
        } else {

            moveCameraArc(deltaX*arcBallScale, deltaY *  arcBallScale);
        }
        // Get how far mouse has travelled (and scale)

        // Update mouse coords
        mouse.pos.x = e.offsetX;
        mouse.pos.y = e.offsetY;

    };

    const onWheel = function (e) {
        e.preventDefault();
        if (mouse.down) return;
        const deltaZ =  e.deltaY * zoomScale;
        if (camera.position.distanceTo(lookAtPoint) + deltaZ > minRadius) {
            camera.translateZ(deltaZ);
        } else {
            messageHandler("Minimum zoom radius reached!")
        }
    };
    //endregion

    //region Event Listeners
    document.addEventListener('mousedown', onMouseDown);
    //document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    //document.addEventListener('touchend', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    //document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('wheel', onWheel);
    //endregion

};



