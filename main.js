// This is your JavaScript code, now in its own file.

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, loadedModel;

// --- 1. CONFIGURATION ---
// 👈 SET YOUR MODEL PATH (relative to the index.html file)
const modelPath = 'tree.obj';

// 👈 SET SPIN SPEED
const rotationSpeed = 0.005;
// --------------------------

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd); // Light gray background

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Move camera back and up slightly

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 'document' is available globally, so this works from an external file
    const container = document.getElementById('scene-container');
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load Model
    loadModel();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function loadModel() {
    const loader = new OBJLoader();

    loader.load(
        // Resource URL
        modelPath,
        // onLoad callback
        function(object) {
            console.log('Model loaded successfully:', object);
            loadedModel = object; // Store the loaded model

            // --- 2. APPLY YOUR TRANSFORMATIONS HERE ---

            // 👈 Example: Set scale (size)
            loadedModel.scale.set(0.5, 0.5, 0.5);

            // 👈 Example: Set initial rotation (in radians)
            // loadedModel.rotation.x = -Math.PI / 2; // Tilt it forward

            // 👈 Example: Set position
            loadedModel.position.set(0, 0, 0); // Center the model

            // --- End of Transformations ---

            // Optional: Apply a default material
            loadedModel.traverse(function(child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x808080, // Gray
                        roughness: 0.5,
                        metalness: 0.5
                    });
                }
            });

            scene.add(loadedModel);
        },
        // onProgress callback
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // onError callback
        function(error) {
            console.error('An error happened while loading the model:', error);
            alert('Error loading model. Check console (F12) for details.');
        }
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Check if the model has been loaded
    if (loadedModel) {
        // 👈 THIS IS THE Y-AXIS SPIN
        loadedModel.rotation.y += rotationSpeed;
    }

    controls.update(); // Update controls (for damping)
    renderer.render(scene, camera);
}
