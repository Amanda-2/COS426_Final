import logo from '../textures/huecluelogo4.svg';

export function createControls(
    onSubmitCallback,
    onQuitCallback,
    onRegenerateCallback,
    stats
) {
    // Create the level display
    const levelDisplay = document.createElement('div');
    levelDisplay.id = 'level-display';
    levelDisplay.innerText = 'Level 1';
    levelDisplay.style.fontSize = '16px';
    levelDisplay.style.position = 'absolute';
    levelDisplay.style.top = '15px';
    levelDisplay.style.left = '20px';
    levelDisplay.style.color = 'white';
    levelDisplay.style.fontFamily = 'Arial, sans-serif';

    // Logo
    const svgImage = document.createElement('img');
    svgImage.id = 'svg-image';
    svgImage.src = logo;
    svgImage.style.width = '80px'; // Adjust size of the SVG
    svgImage.style.height = '80px'; // Adjust size of the SVG
    svgImage.style.position = 'absolute';
    svgImage.style.top = '20px'; // Same top as input and button
    svgImage.style.left = '98px'; // Place it next to the submit button

    // Title
    const title = document.createElement('div');
    title.id = 'level-display';
    title.innerText = 'HUE \b \b \b \b \b CLUE';
    title.style.fontSize = '40px';
    title.style.position = 'absolute';
    title.style.top = '40px';
    title.style.left = '20px';
    title.style.color = 'white';
    title.style.fontFamily = 'Arial, sans-serif';

    // Create the input box
    const inputBox = document.createElement('input');
    inputBox.id = 'name-input';
    inputBox.type = 'text';
    inputBox.placeholder = 'Enter answer';
    inputBox.style.fontSize = '16px';
    inputBox.style.padding = '10px 20px'; // Oval shape padding
    inputBox.style.borderRadius = '25px'; // Oval shape
    inputBox.style.border = '2px solid black'; // Border for visibility
    inputBox.style.outline = 'none'; // Remove default outline
    inputBox.style.width = '150px'; // Set width for a wider input box
    inputBox.style.position = 'absolute'; // Positioning independently
    inputBox.style.top = '100px'; // Adjust top position
    inputBox.style.left = '15px'; // Adjust left position

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'submit-button';
    submitButton.innerText = 'Submit';
    submitButton.style.fontSize = '16px';
    submitButton.style.padding = '5px';
    submitButton.style.color = 'white';
    submitButton.style.backgroundColor = 'black';
    submitButton.style.border = '2px solid white';
    submitButton.style.borderRadius = '50px';
    submitButton.style.padding = '10px 20px';
    submitButton.style.cursor = 'pointer';

    submitButton.style.position = 'absolute'; // Independent positioning
    submitButton.style.top = '100px'; // Same as input box for alignment
    submitButton.style.left = '220px'; // Place right next to input box

    // Create the quit button
    const quitButton = document.createElement('button');
    quitButton.id = 'quit-button';
    quitButton.innerText = 'Quit Game';
    quitButton.style.fontSize = '16px';
    quitButton.style.color = 'white';
    quitButton.style.backgroundColor = 'black';
    quitButton.style.border = '2px solid white';
    quitButton.style.borderRadius = '50px';
    quitButton.style.padding = '10px 20px';
    quitButton.style.cursor = 'pointer';

    quitButton.style.position = 'absolute'; // Position relative to the screen
    quitButton.style.top = '280px'; // Distance from the top of the screen
    quitButton.style.left = '30px'; // Distance from the right edge of the screen

    const circle_offset = -150;
    const circle_radius = 450;

    // Create the quarter-circle
    const quarterCircle = document.createElement('div');
    quarterCircle.id = 'quarter-circle';
    quarterCircle.style.position = 'absolute';
    quarterCircle.style.top = `${circle_offset}px`;
    quarterCircle.style.left = `${circle_offset}px`;
    quarterCircle.style.width = `${circle_radius}px`; // Adjust size as needed
    quarterCircle.style.height = `${circle_radius}px`; // Adjust size as needed
    quarterCircle.style.backgroundColor = 'black';
    quarterCircle.style.borderRadius = `${circle_radius}px`; // Top-left quarter-circle
    quarterCircle.style.border = '2px solid white';

    // Reset button?
    const rButton = document.createElement('button');
    rButton.id = 'r-button';
    rButton.innerText = 'Regenerate';
    rButton.style.fontSize = '16px';
    rButton.style.color = 'white';
    rButton.style.backgroundColor = 'black';
    rButton.style.border = '2px solid white';
    rButton.style.borderRadius = '50px';
    rButton.style.padding = '10px 20px';
    rButton.style.cursor = 'pointer';

    rButton.style.position = 'absolute'; // Position relative to the screen
    rButton.style.top = '220px'; // Distance from the top of the screen
    rButton.style.left = '120px'; // Distance from the right edge of the screen

    // How to play button
    const hButton = document.createElement('button');
    hButton.id = 'h-button';
    hButton.innerText = 'How to Play';
    hButton.style.fontSize = '16px';
    hButton.style.color = 'white';
    hButton.style.backgroundColor = 'black';
    hButton.style.border = '2px solid white';
    hButton.style.borderRadius = '50px';
    hButton.style.padding = '10px 20px';
    hButton.style.cursor = 'pointer';

    hButton.style.position = 'absolute'; // Position relative to the screen
    hButton.style.top = '160px'; // Distance from the top of the screen
    hButton.style.left = '170px'; // Distance from the right edge of the screen

    // Append the quarter-circle to the document body
    document.body.appendChild(quarterCircle);
    document.body.appendChild(levelDisplay);
    document.body.appendChild(svgImage);
    document.body.appendChild(title);
    document.body.appendChild(quitButton);
    document.body.appendChild(inputBox);
    document.body.appendChild(submitButton);

    document.body.appendChild(rButton);
    document.body.appendChild(hButton);

    // Add event listeners
    const handleSubmission = () => {
        const inputValue = inputBox.value.trim();
        if (onSubmitCallback) {
            onSubmitCallback(inputValue); // Trigger submission callback
        }
        inputBox.value = ''; // Clear the input box
    };

    // Submit button click listener
    submitButton.addEventListener('click', handleSubmission);

    // Submit button Enter key listener
    inputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSubmission(); // Trigger submission
        }
    });

    submitButton.addEventListener('mouseover', () => {
        submitButton.style.transform = 'scale(1.1)'; // Slightly larger button
        submitButton.style.transition = 'transform 0.2s'; // Smooth animation
    });

    submitButton.addEventListener('mouseout', () => {
        submitButton.style.transform = 'scale(1)'; // Revert to original size
    });

    rButton.addEventListener('click', () => {
        if (onRegenerateCallback) {
            onRegenerateCallback(); // Regenerate scene callback
        }
    });

    rButton.addEventListener('mouseover', () => {
        rButton.style.transform = 'scale(1.1)'; // Slightly larger button
        rButton.style.transition = 'transform 0.2s'; // Smooth animation
    });

    rButton.addEventListener('mouseout', () => {
        rButton.style.transform = 'scale(1)'; // Revert to original size
    });

    hButton.addEventListener('mouseover', () => {
        hButton.style.transform = 'scale(1.1)'; // Slightly larger button
        hButton.style.transition = 'transform 0.2s'; // Smooth animation
    });

    hButton.addEventListener('mouseout', () => {
        hButton.style.transform = 'scale(1)'; // Revert to original size
    });

    hButton.addEventListener('click', showHowToPlayOverlay);

    quitButton.addEventListener('click', () => {
        if (onQuitCallback) {
            onQuitCallback(stats); // Trigger quit callback
        }
    });

    quitButton.addEventListener('mouseover', () => {
        quitButton.style.transform = 'scale(1.1)'; // Slightly larger button
        quitButton.style.transition = 'transform 0.2s'; // Smooth animation
    });

    quitButton.addEventListener('mouseout', () => {
        quitButton.style.transform = 'scale(1)'; // Revert to original size
    });

    // Return a function to update the level display
    return (newLevel) => {
        levelDisplay.innerText = `Level ${newLevel}`;
    };
}

export function showHowToPlayOverlay() {
    const fontLink = document.createElement('link');
    fontLink.href =
        'https://fonts.googleapis.com/css2?family=Gotu&family=Poiret+One&family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    // Check if the overlay already exists
    let overlay = document.getElementById('how-to-play-overlay');
    if (!overlay) {
        // Create the overlay if it doesn't exist
        overlay = document.createElement('div');
        overlay.id = 'how-to-play-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        // overlay.style.fontFamily = 'Gotu, sans-serif';
        overlay.style.zIndex = '1000';

        // Instruction text
        const instructions = document.createElement('div');
        instructions.style.fontFamily = 'Albert Sans, sans-serif';
        instructions.style.lineHeight = '1.5';
        instructions.style.fontWeight = '200';
        instructions.innerHTML = `
            Welcome to <b>HUE CLUE</b>! <br><br>
            
            - Your goal is to pick the object whose color is different from the rest.<br>
            - Textures are meant to make it more difficult. Your goal is not to find the different <em>texture</em>, but to
            look past the texture and find the different color! Textures have 2 colors. Both colors are different in the correct object. <br>
            - As you advance through the levels, the number of objects, the number of differnt types of objects, and the number of different
            textures will increase. The color difference will decrease, making it harder to spot. How long can you last? <br>
            - In the top-left corner, type the number associated with your chosen object.<br>
            - Click "Submit" or press Enter to see whether you're correct.<br>
            - You earn points based on accuracy and time.<br><br>
            
            Good luck and have fun!
        `;
        instructions.style.textAlign = 'center';
        instructions.style.padding = '20px';
        instructions.style.fontSize = '18px';
        instructions.style.maxWidth = '80%';
        overlay.appendChild(instructions);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.style.fontFamily = 'Albert Sans, sans-serif';
        closeButton.style.fontWeight = '200';
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '15px';
        closeButton.style.fontSize = '18px';
        closeButton.style.padding = '5px 15px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        overlay.appendChild(closeButton);

        // Append overlay to body
        document.body.appendChild(overlay);
    }

    // Show the overlay
    overlay.style.display = 'flex';
}
