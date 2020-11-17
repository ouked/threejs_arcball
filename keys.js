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

        case 71: // g - open github
            window.open(githubURL);
            break;
        case 72: // h - help
            showHelp();
            break;

        case 48: // 0 - reset camera
            camera.position.set(3,4,5);
            camera.lookAt(new THREE.Vector3(0,0,0));
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
