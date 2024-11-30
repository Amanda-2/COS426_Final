import * as Dat from 'dat.gui';
import { Scene, Color} from 'three';
import { Flower, Land, Cube, Floor, Box } from 'objects';
import { BasicLights } from 'lights';
import { createControls } from './createControls.js';

class SeedScene extends Scene {
    constructor(quitCallback) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            // TO-DO: Adjust rotation speed here. Remove from GUI or leave in?
            rotationSpeed: 1,
            updateList: [],
            level: 1,
            solution: Math.floor(Math.random() * 3) + 1 // Replace with actual logic
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // TO-DO: Implement actual game mechanics here
        // Make this more generalized or make multiple scenes?
        this.level1 = {
            numBoxes: 3,
        };

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const cube = new Cube(this);
        const lights = new BasicLights();
        const floor = new Floor();
        const box = new Box(this.level1.numBoxes);

        this.add(lights, floor, box);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        this.updateLevelDisplay = createControls(
            (inputValue) => this.handleSubmit(inputValue),
            quitCallback
        );

        this.updateLevelDisplay(this.state.level);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    handleSubmit(inputValue) {
        //console.log(`Input submitted: ${inputValue}`);
        
        if (inputValue === `${this.state.solution}`) {
            alert('Correct!');
            this.levelUp();
        } else {
            alert('Try again.');
        }
    }

    levelUp(){
        this.state.level += 1;
        this.updateLevelDisplay(this.state.level);

        // Replace with actual logic
        this.state.solution = Math.floor(Math.random() * this.boxesPerLevel()) + 1;

        // Make new scene
        this.newSeedScene();
    }

    newSeedScene() {
        // Clear old scene
        while (this.children.length) {
            this.remove(this.children[0]);
        }

        // Construct new scene
        const lights = new BasicLights();
        const floor = new Floor();
        const box = new Box(this.boxesPerLevel());
        this.add(lights, floor, box);
    }

    // Increase number of boxes every 3 levels
    boxesPerLevel(){
        return Math.ceil(this.state.level / 3.0) + 2;
    }

}

export default SeedScene;
