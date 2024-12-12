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
import logo2 from '../src/components/textures/huecluelogo4.svg';
import dividersvg from '../src/components/textures/divider.svg';
import { showHowToPlayOverlay } from './components/scenes/createControls.js';

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
    camera.position.set(8, 5, -8);
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

function initMenu(stats = null) {
    // Clear scene (hopefully preserves computation a bit)
    if (scene) {
        scene.dispose();
    }
    // scene = null;
    initGame(10);

    const fontLink = document.createElement('link');
    fontLink.href =
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Poiret+One&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Create the menu container
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '0';
    menuContainer.style.left = '0';
    menuContainer.style.width = '100%';
    menuContainer.style.height = '100%';
    menuContainer.style.backgroundColor = 'rgba(0,0,0,0.9)'; // Dark background
    // menuContainer.style.opacity = '0.85'; // Slightly transparent
    menuContainer.style.color = 'white';
    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.alignItems = 'center';
    menuContainer.style.justifyContent = 'center';

    const logo = document.createElement('img');
    logo.id = 'svg-image';
    logo.src = logo2;
    logo.style.width = '10%'; // Adjust size of the SVG
    logo.style.height = '10%'; // Adjust size of the SVG
    logo.style.top = '5%'; // Same top as input and button
    logo.style.left = '5%'; // Place it next to the submit button
    logo.style.opacity = '0.8';
    logo.style.alignItems = 'center';
    logo.style.justifyContent = 'center';
    menuContainer.appendChild(logo);

    // Title
    const title = document.createElement('text');
    title.style.fontFamily = 'Poiret One, sans-serif';
    title.innerText = 'HUE CLUE';
    title.style.marginBottom = '40px';
    title.style.fontSize = '40px';
    menuContainer.appendChild(title);

    // Create the main container
    const carouselContainer = document.createElement('div');
    carouselContainer.id = 'carousel-container';
    carouselContainer.style.position = 'relative';
    carouselContainer.style.width = '100%';
    carouselContainer.style.maxWidth = '800px';
    carouselContainer.style.height = '160px';
    carouselContainer.style.marginBottom = '20px';
    carouselContainer.style.overflow = 'hidden'; // Hide items outside the container

    // Level carousel
    const carousel = document.createElement('div');
    carousel.id = 'level-carousel';
    carousel.style.display = 'flex';
    carousel.style.alignItems = 'center';
    carousel.style.gap = '50px'; // Add space between items
    carousel.style.transition = 'transform 0.3s ease';
    carouselContainer.appendChild(carousel);

    // Create carousel items
    const maxLevel = 10;
    const containerHeight = parseInt(carouselContainer.style.height, 10);
    const itemWidth = containerHeight;
    const items = [];
    for (let i = 1; i <= maxLevel; i++) {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        // item.innerText = `Level ${i}`;
        item.style.flex = `0 0 ${itemWidth}px`; // Each item takes 100% of the container width
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.fontSize = '2rem';
        item.style.height = `${containerHeight}px`;
        item.style.background = `rgba(${50 * i}, ${
            50 * (maxLevel - i)
        }, 255, 0.6)`; // Dynamic colors
        item.style.transition = 'opacity 0.3s ease';
        item.style.opacity = '0';
        // Add formatted text
        const levelText = document.createElement('div');
        levelText.style.fontFamily = "'Cinzel', serif"; // Custom font
        levelText.style.textAlign = 'center'; // Center-align text
        levelText.style.lineHeight = '1.2'; // Adjust line height for proper spacing
        levelText.style.display = 'flex';
        levelText.style.flexDirection = 'column';
        levelText.style.justifyContent = 'center';
        levelText.style.alignItems = 'center';
        levelText.innerHTML = `
            <span style="font-size: 0.8em;">Level</span>
            <span style="font-size: 2.0em;">${i}</span>
        `;
        item.appendChild(levelText);
        carousel.appendChild(item);
        items.push(item);
    }
    menuContainer.appendChild(carouselContainer);

    document.body.appendChild(menuContainer);

    // Carousel logic
    let currentLevel = 0;
    let startX = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;
    let isDragging = false;

    function setCarouselPosition(translateX) {
        carousel.style.transform = `translateX(${translateX}px)`;
    }

    function updateItemVisibility() {
        items.forEach((item, index) => {
            if (index === currentLevel) {
                item.style.opacity = '1'; // Fully visible
                item.style.zIndex = '2'; // Bring the central item to the front
            } else if (
                index === currentLevel - 1 ||
                index === currentLevel + 1
            ) {
                item.style.opacity = '0.5'; // Semi-transparent for neighboring items
                item.style.zIndex = '1';
            } else {
                item.style.opacity = '0'; // Hide all other items
                item.style.zIndex = '0';
            }
        });
    }

    function animateToCurrentIndex() {
        const gap = 50; // The space between items (match the carousel's gap)
        const containerCenter = carouselContainer.offsetWidth / 2;
        const maxTranslate =
            -(maxLevel - 1) * (itemWidth + gap) +
            containerCenter -
            itemWidth / 2;
        const minTranslate = containerCenter - itemWidth / 2;

        currentTranslate = Math.max(
            Math.min(
                -currentLevel * (itemWidth + gap) +
                    containerCenter -
                    itemWidth / 2,
                minTranslate
            ),
            maxTranslate
        );
        // currentTranslate = -currentLevel * carouselContainer.offsetWidth;
        setCarouselPosition(currentTranslate);
        updateItemVisibility();
    }

    // Variables for two-finger swipe
    let isTwoFingerSwipe = false;
    let startXTwoFingers = 0;
    // Add mouse/touch events for dragging
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('touchstart', startDrag);
    carousel.addEventListener('mousemove', drag);
    carousel.addEventListener('touchmove', drag);
    carousel.addEventListener('mouseup', endDrag);
    carousel.addEventListener('mouseleave', endDrag);
    carousel.addEventListener('touchend', endDrag);

    function startDrag(event) {
        if (event.type === 'touchstart' && event.touches) {
            // Two-finger swipe
            console.log('here');
            isTwoFingerSwipe = true;
            startXTwoFingers = getAverageTouchX(event); // Calculate average X position of two fingers
            previousTranslate = currentTranslate;
        } else if (
            event.type === 'mousedown' ||
            (event.type === 'touchstart' && event.touches.length === 1)
        ) {
            // Single-finger drag
            isDragging = true;
            startX = getPositionX(event);
            previousTranslate = currentTranslate;
            carousel.style.cursor = 'grabbing'; // Change cursor while dragging
        }
    }

    function drag(event) {
        if (isTwoFingerSwipe && event.touches.length > 1) {
            // Handle two-finger swipe
            const currentXTwoFingers = getAverageTouchX(event);
            const deltaX = currentXTwoFingers - startXTwoFingers;
            currentTranslate = previousTranslate + deltaX;
            setCarouselPosition(currentTranslate);
        } else if (isDragging) {
            // Handle single-finger drag
            const currentX = getPositionX(event);
            const deltaX = currentX - startX;
            currentTranslate = previousTranslate + deltaX;
            setCarouselPosition(currentTranslate);
        }
    }

    function endDrag(event) {
        if (isTwoFingerSwipe || isDragging) {
            isDragging = false;
            isTwoFingerSwipe = false;
            carousel.style.cursor = 'grab'; // Reset cursor

            // Snap to nearest item
            const gap = 50; // Match the space between items
            const translateAmount = -(
                currentTranslate -
                (carouselContainer.offsetWidth / 2 - itemWidth / 2)
            );
            const moveBy = Math.round(translateAmount / (itemWidth + gap)); // Calculate nearest item
            currentLevel = Math.min(Math.max(moveBy, 0), maxLevel - 1); // Clamp index between 0 and maxLevel - 1
            animateToCurrentIndex();
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse')
            ? event.clientX
            : event.touches[0].clientX;
    }

    function getAverageTouchX(event) {
        // Calculate the average X position of two fingers
        return (event.touches[0].clientX + event.touches[1].clientX) / 2;
    }

    // Initialize carousel position
    animateToCurrentIndex();

    // Start button
    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.fontSize = '30px';
    startButton.style.fontFamily = 'Poiret One, sans-serif';
    startButton.style.padding = '5px 10px';
    startButton.style.marginBottom = '20px';
    startButton.style.cursor = 'pointer';
    startButton.style.background = 'transparent'; // Initially transparent
    startButton.style.color = 'white'; // Text color
    startButton.style.border = 'none';
    startButton.style.outline = 'none';
    startButton.style.boxShadow = 'none';
    startButton.style.transition = 'background-color 0.5s ease'; // Smooth transition for hover effect

    // Add hover effect using JavaScript
    startButton.addEventListener('mouseenter', () => {
        startButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white
        startButton.style.color = 'black';
    });
    startButton.addEventListener('mouseleave', () => {
        startButton.style.backgroundColor = 'transparent'; // Back to transparent
        startButton.style.color = 'white';
    });
    menuContainer.appendChild(startButton);

    // Start button
    const helpButton = document.createElement('button');
    helpButton.innerText = 'How to Play';
    helpButton.style.fontSize = '30px';
    helpButton.style.fontFamily = 'Poiret One, sans-serif';
    helpButton.style.padding = '5px 10px';
    helpButton.style.marginBottom = '20px';
    helpButton.style.cursor = 'pointer';
    helpButton.style.background = 'transparent'; // Initially transparent
    helpButton.style.color = 'white'; // Text color
    helpButton.style.border = 'none';
    helpButton.style.outline = 'none';
    helpButton.style.boxShadow = 'none';
    helpButton.style.transition = 'background-color 0.5s ease'; // Smooth transition for hover effect

    // Add hover effect using JavaScript
    helpButton.addEventListener('mouseenter', () => {
        helpButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white
        helpButton.style.color = 'black';
    });
    helpButton.addEventListener('mouseleave', () => {
        helpButton.style.backgroundColor = 'transparent'; // Back to transparent
        helpButton.style.color = 'white';
    });
    menuContainer.appendChild(helpButton);

    const divider = document.createElement('img');
    divider.id = 'svg-image';
    divider.src = dividersvg;
    divider.style.width = '20%'; // Adjust size of the SVG
    divider.style.height = '20%'; // Adjust size of the SVG
    divider.style.opacity = '0.8';
    const divider2 = divider.cloneNode(true);
    divider2.style.transform = 'rotate(180deg)';

    const statsContainer = document.createElement('div');
    statsContainer.style.display = 'none';
    statsContainer.style.textAlign = 'center';
    statsContainer.style.width = '100%';
    statsContainer.style.fontFamily = 'Poiret One, sans-serif';
    menuContainer.appendChild(statsContainer);

    if (stats) {
        statsContainer.style.display = 'block';
        statsContainer.appendChild(divider);
        const statsTitle = document.createElement('div');
        statsTitle.innerText = 'GAME STATISTICS';
        statsContainer.appendChild(statsTitle);
        statsTitle.style.fontSize = '30px';

        const statsContent = `
            <p>Score: ${stats.score}</p>
            <p>Fastest Time: ${
                stats.minTime ? stats.minTime.toFixed(2) + 's' : 'N/A'
            }</p>
            <p>Slowest Time: ${
                stats.maxTime ? stats.maxTime.toFixed(2) + 's' : 'N/A'
            }</p>
            <p>Smallest Offset: ${stats.minOffset || 'N/A'}</p>
        `;

        statsContainer.innerHTML += statsContent;
        statsContainer.appendChild(divider2);
    }

    startButton.addEventListener('click', () => {
        initGame(currentLevel + 1);
    });

    // Event listener to show the overlay
    helpButton.addEventListener('click', () => {
        showHowToPlayOverlay();
    });
}

// Quit game
function quitGame(stats) {
    // Suggested TODO:
    // Display score, reset game state, transition to main menu
    initMenu(stats);
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
