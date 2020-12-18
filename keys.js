// Listen for keyboard events, to react to them.
// Note: there are also other event listeners, e.g. for mouse events.
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

/**
 * Handle keyDown events
 * @param event keyDown event
 */
function handleKeyDown(event)
{
    switch (event.keyCode)
    {
        // Render modes.
        case 70: // f = face
            scene.remove(points);
            scene.remove(line);
            scene.add(cube);
            break;

        case 69: // e = edge
            scene.remove(points);
            scene.remove(cube);
            scene.add(line);
            break;

        case 86: // v = vertex
            scene.remove(cube);
            scene.remove(line);
            scene.add(points);
            break;

        //    Peter
        case 74: // j = peter face
            scene.remove(peterPoints);
            scene.remove(peterEdges);
            scene.add(peter);
            break;

        case 75: // k = peter line
            scene.remove(peterPoints);
            scene.remove(peter);
            scene.add(peterEdges);
            break;

        case 76: // l = peter vertex
            scene.remove(peter);
            scene.remove(peterEdges);
            scene.add(peterPoints);
            break;

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

/**
 * Handle keyUp events
 * @param event keyUp Event
 */
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
