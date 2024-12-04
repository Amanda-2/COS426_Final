import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Cube, Floor, Skybox, Box, Level } from 'objects';
import { BasicLights } from 'lights';
import { createControls } from './createControls.js';
// import { Level } from "level";

class SeedScene extends Scene {
    constructor(quitCallback) {
        // Call parent Scene() constructor
        super();

        // let temp = new Level();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            // TO-DO: Adjust rotation speed here. Remove from GUI or leave in?
            rotationSpeed: 1,
            updateList: [],
            levelNumber: 1,
            level: new Level(1),
        };

        console.log(this.state.level);

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        const skybox = new Skybox();
        this.add(skybox);

        // TO-DO: Implement actual game mechanics here
        // Make this more generalized or make multiple scenes?
        this.level1 = {
            numBoxes: 10,
        };

        // Empirically, 20 is difficult but possible. 10 is hard, but *mostly* possible.
        this.colorOffset = 8 / 255;

        // Add meshes to scene
        const lights = new BasicLights();
        const floor = new Floor();
        const box = new Box(
            this,
            this.state.level.state.answer,
            this.state.level.state.numBoxes,
            this.state.level.state.offset
        );
        // const box = new Box(this);

        this.add(lights, floor, box);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        this.updateLevelDisplay = createControls(
            (inputValue) => this.handleSubmit(inputValue),
            quitCallback
        );

        this.updateLevelDisplay(this.state.levelNumber);
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
        console.log(`Input submitted: ${inputValue}`);

        if (this.state.level.checkAnswer(inputValue)) {
            alert('Correct!');
            this.levelUp();
        } else {
            alert('Try again.');
        }
    }

    levelUp() {
        this.state.levelNumber += 1;
        this.state.level = new Level(this.state.levelNumber);
        this.updateLevelDisplay(this.state.levelNumber);

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
        const box = new Box(
            this,
            this.state.level.state.answer,
            this.state.level.state.numBoxes,
            this.state.level.state.offset
        );
        this.add(lights, floor, box);
    }
}

export default SeedScene;
