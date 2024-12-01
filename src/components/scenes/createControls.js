export function createControls(onSubmitCallback, onQuitCallback) {
   // Create the container
   const inputContainer = document.createElement('div');
   inputContainer.id = 'input-container';
   inputContainer.style.position = 'absolute';
   inputContainer.style.top = '10px';
   inputContainer.style.left = '10px';
   inputContainer.style.zIndex = '10';

   // Create the level display
   const levelDisplay = document.createElement('div');
   levelDisplay.id = 'level-display';
   levelDisplay.innerText = 'Level: 1';
   levelDisplay.style.fontSize = '16px';
   levelDisplay.style.marginBottom = '10px';

   // Create the input box
   const inputBox = document.createElement('input');
   inputBox.id = 'name-input';
   inputBox.type = 'text';
   inputBox.placeholder = 'Enter answer';
   inputBox.style.fontSize = '16px';
   inputBox.style.padding = '5px';

   // Create the submit button
   const submitButton = document.createElement('button');
   submitButton.id = 'submit-button';
   submitButton.innerText = 'Submit';
   submitButton.style.fontSize = '16px';
   submitButton.style.padding = '5px';

   // Create the quit button
   const quitButton = document.createElement('button');
   quitButton.id = 'quit-button';
   quitButton.innerText = 'Quit Game';
   quitButton.style.fontSize = '16px';
   quitButton.style.padding = '5px';
   quitButton.style.marginLeft = '5px';

   // Append elements to the container
   inputContainer.appendChild(levelDisplay);
   inputContainer.appendChild(inputBox);
   inputContainer.appendChild(submitButton);
   inputContainer.appendChild(quitButton);

   // Append the container to the document body
   document.body.appendChild(inputContainer);

   // Add event listeners
   submitButton.addEventListener('click', () => {
       const inputValue = inputBox.value.trim();
       if (onSubmitCallback) {
           onSubmitCallback(inputValue); // Trigger submission callback
       }
       inputBox.value = ''; // Clear the input box
   });

   quitButton.addEventListener('click', () => {
       if (onQuitCallback) {
           onQuitCallback(); // Trigger quit callback
       }
   });

   // Return a function to update the level display
   return (newLevel) => {
       levelDisplay.innerText = `Level: ${newLevel}`;
   };
}