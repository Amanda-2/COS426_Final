import logo from '../src/components/textures/huecluelogo4.svg';
/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    PCFSoftShadowMap,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Core ThreeJS components
let scene, camera, renderer, controls;

function initGame(selectedLevel) {
    // Clear any existing UI
    document.body.innerHTML = '';

    // Initialize core ThreeJS components
    scene = new SeedScene(quitGame, selectedLevel);
    camera = new PerspectiveCamera();
    renderer = new WebGLRenderer({ antialias: true });    

    // Set up camera
    camera.position.set(6, 3, -10);
    camera.lookAt(new Vector3(0, 0, 0));

    // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling
    document.body.appendChild(canvas);

    // Set up controls
    // TO-DO: Create OrbitControls class instance using new controls?
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.update();
    // TO-DO: add controls.
    // What controls?
    // input, level, restart, clear selection, quit?

    // Start render loop
    window.requestAnimationFrame(onAnimationFrameHandler);

    // Resize handler
    windowResizeHandler();
    window.addEventListener('resize', windowResizeHandler, false);    
}

function initMenu() {
    // Clear scene (hopefully preserves computation a bit)
    if (scene) {
        scene.dispose();
    }
    scene = null;

    // Create the menu container
    
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '0';
    menuContainer.style.left = '0';
    menuContainer.style.width = '100%';
    menuContainer.style.height = '100%';
    menuContainer.style.background = 'black'; // Dark background
    menuContainer.style.color = 'white';
    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.alignItems = 'center';
    menuContainer.style.justifyContent = 'center';

    
    /*
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.textAlign = 'center';
    menuContainer.style.fontFamily = 'Arial, sans-serif';
    */

    // Title
    const title = document.createElement('h1');
    title.style.fontFamily = 'Arial, sans-serif';
    title.innerText = 'Game Menu';
    title.style.marginBottom = '20px';
    menuContainer.appendChild(title);

    // Logo
    /*
    const svgImage = document.createElement('img');
    svgImage.id = 'svg-image';
    svgImage.src = logo;
    svgImage.style.width = '90%'; // Adjust size of the SVG
    svgImage.style.height = '90%'; // Adjust size of the SVG
    //svgImage.style.position = 'absolute';
    svgImage.style.top = '5%'; // Same top as input and button
    svgImage.style.left = '5%'; // Place it next to the submit button
    svgImage.style.opacity = '50%';
    //document.body.appendChild(svgImage);
    menuContainer.appendChild(svgImage);
    */

    // Level carousel
    const carousel = document.createElement('div');
    carousel.id = 'level-carousel';
    carousel.style.display = 'flex';
    carousel.style.alignItems = 'center';
    carousel.style.marginBottom = '20px';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerText = '<';
    prevButton.style.marginRight = '10px';
    prevButton.style.fontSize = '24px';
    prevButton.style.padding = '5px 15px';
    prevButton.style.cursor = 'pointer';
    carousel.appendChild(prevButton);

    // Level display
    const levelDisplay = document.createElement('div');
    levelDisplay.id = 'selected-level';
    levelDisplay.innerText = 'Level 1';
    levelDisplay.style.fontSize = '24px';
    levelDisplay.style.fontWeight = 'bold';
    levelDisplay.style.padding = '10px 20px';
    levelDisplay.style.border = '2px solid white';
    levelDisplay.style.borderRadius = '8px';
    levelDisplay.style.minWidth = '100px';
    levelDisplay.style.textAlign = 'center';
    carousel.appendChild(levelDisplay);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerText = '>';
    nextButton.style.marginLeft = '10px';
    nextButton.style.fontSize = '24px';
    nextButton.style.padding = '5px 15px';
    nextButton.style.cursor = 'pointer';
    carousel.appendChild(nextButton);

    // Add carousel to menu
    menuContainer.appendChild(carousel);

    // Start button
    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.fontSize = '20px';
    startButton.style.padding = '10px 20px';
    startButton.style.cursor = 'pointer';
    menuContainer.appendChild(startButton);

    // Append the menu container to the document body
    document.body.appendChild(menuContainer);
    //document.body.style.backgroundColor = 'black';

    // JavaScript Logic for Carousel
    let currentLevel = 1;
    const maxLevel = 10; // Example: max 10 levels

    prevButton.addEventListener('click', () => {
        if (currentLevel > 1) {
            currentLevel--;
            levelDisplay.innerText = `Level ${currentLevel}`;
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentLevel < maxLevel) {
            currentLevel++;
            levelDisplay.innerText = `Level ${currentLevel}`;
        }
    });

    startButton.addEventListener('click', () => {
        initGame(currentLevel);
    });

    /*

    // Clear any existing UI
    document.body.innerHTML = '';

    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.textAlign = 'center';
    menuContainer.style.fontFamily = 'Arial, sans-serif';

    // Menu title
    const title = document.createElement('h1');
    title.innerText = 'Main Menu';
    title.style.marginBottom = '20px';
    title.style.color = 'white';
    menuContainer.appendChild(title);

    // Start game button
    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '16px';
    startButton.style.cursor = 'pointer';
    startButton.onclick = () => initGame(); // Start game on click
    menuContainer.appendChild(startButton);

    // Logo
    const svgImage = document.createElement('img');
    svgImage.id = 'svg-image';
    svgImage.src = logo;
    svgImage.style.width = '90%'; // Adjust size of the SVG
    svgImage.style.height = '90%'; // Adjust size of the SVG
    svgImage.style.position = 'absolute';
    svgImage.style.top = '5%'; // Same top as input and button
    svgImage.style.left = '5%'; // Place it next to the submit button
    svgImage.style.opacity = '50%';
    document.body.appendChild(svgImage);

    // Append menu to body
    document.body.appendChild(menuContainer);
    document.body.style.backgroundColor = 'black';
    */
}

// Quit game
function quitGame() {
    // Suggested TODO: 
    // Display score, reset game state, transition to main menu
    alert('Returning to the main menu...');
    initMenu();
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
        if (scene.update) scene.update(timeStamp);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

initMenu();