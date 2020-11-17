// Alex Dawkins ArcBall
// For three.js

"use strict";

let ArcBall = function (camera) {
    let mouse = {
        pos: new THREE.Vector2(),
        down: false
    };

    const minRadius = 1;
    //region Mouse Events
    const onMouseDown = function(e) {
        mouse.pos = new THREE.Vector2(e.offsetX, e.offsetY);
        mouse.down = true;
    };

    const onMouseUp = function() { mouse.down = false; };

    const onMouseMove = function (e) {
        e.preventDefault();
        if (!mouse.down) return;

        // Get how far mouse has travelled (and scale)
        const scale = 0.002;
        const deltaX = (mouse.pos.x - e.offsetX) * scale;
        const deltaY = (mouse.pos.y - e.offsetY) * scale;

        const x = camera.position.x;
        const y = camera.position.y;
        const z = camera.position.z;


        const radius = camera.position.length();
        let theta = Math.atan2(x, z ); // equator angle around y-up axis
        let phi = Math.acos( Math.min(Math.max( y / radius, - 1), 1 )); // polar angle


        phi += deltaY;
        theta += deltaX;


        camera.position.set(
            radius * Math.sin( phi ) * Math.sin( theta ),
            radius * Math.cos( phi ),
            radius * Math.sin( phi ) * Math.cos( theta )
        );

        // Rotate camera to look at target
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Update mouse coords
        mouse.pos.x = e.offsetX;
        mouse.pos.y = e.offsetY;

    };

    const onWheel = function (e) {
        e.preventDefault();
        if (mouse.down) return;
        const scale = 0.01;
        const deltaRadius = e.deltaY * scale;
        // Convert from cartesian to spherical coordinates
        let spherical = new THREE.Spherical().setFromVector3(camera.position);

        const newRadius = Math.max(spherical.radius + deltaRadius, minRadius);
        // Change spherical coordinates
        spherical.set(newRadius, spherical.phi, spherical.theta);

        // Convert back to Cartesian
        const newPos = new THREE.Vector3().setFromSpherical(spherical);

        // Update Camera
        camera.position.set(newPos.x, newPos.y, newPos.z);

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



