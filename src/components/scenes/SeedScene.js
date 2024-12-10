import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Floor, Skybox, Primitive, Level } from 'objects';
import { BasicLights } from 'lights';
import { createControls } from './createControls.js';
// import { Level } from "level";

class SeedScene extends Scene {
    constructor(quitCallback, initialLevel = 1) {
        // Call parent Scene() constructor
        super();


        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            levelNumber: initialLevel,
            level: new Level(initialLevel),
        };

        this.stats =
        {
            "score": 0,
            "times": [],
            "minTime": null,
            "maxTime": null,
            "offsets": [],
            "minOffset": 0
        }

        this.startTime = new Date();

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const lights = new BasicLights();
        const floor = new Floor();
        const skybox = new Skybox();
        const prim = new Primitive(
            this,
            this.state.level.state.answer,
            this.state.level.state.numPrim,
            this.state.level.state.offset,
            this.state.level.state.primTypes,
            this.state.level.state.texture
        );

        this.add(lights, floor, skybox, prim);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        this.updateLevelDisplay = createControls(
            (inputValue) => this.handleSubmit(inputValue),
            quitCallback,
            () => this.newSeedScene(), // Regenerate callback
            this.stats
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
        if (this.state.level.checkAnswer(inputValue)) {
            alert('Correct!');
            this.levelUp();
        } else {
            alert('Not quite. Try again.');
        }
    }

    levelUp() {
        this.updateStats();
        this.state.levelNumber += 1;
        this.state.level = new Level(this.state.levelNumber);
        this.updateLevelDisplay(this.state.levelNumber);

        // Make new scene
        this.newSeedScene();
    }

    newSeedScene() {
        // Clear old scene
        this.dispose()

        // Construct new scene
        const lights = new BasicLights();
        const floor = new Floor();
        const skybox = new Skybox();
        const prim = new Primitive(
            this,
            this.state.level.state.answer,
            this.state.level.state.numPrim,
            this.state.level.state.offset,
            this.state.level.state.primTypes,
            this.state.level.state.texture
        );
        this.add(lights, floor, skybox, prim);
    }

    updateStats() {
        let levelTime = Date.now() - this.startTime
        let thisOffset = this.state.level.getOffset()
        this.stats.times.push(levelTime)
        this.stats.times.sort();
        this.stats.maxTime = this.stats.times[this.stats.times.length - 1] / 1000
        this.stats.minTime = this.stats.times[0] / 1000;
        this.stats.offsets.push(thisOffset)
        this.stats.offsets.sort();
        this.stats.minOffset = this.stats.offsets[this.stats.offsets.length - 1];

        this.stats.score = Math.ceil(this.stats.score + (((1000 / levelTime) * (100 / thisOffset)) * 1000))
    }

    changeLevel(newLevel) {
        this.state.levelNumber = newLevel;
        this.state.level = new Level(newLevel);
        this.updateLevelDisplay(newLevel);

        this.newSeedScene();
    }

    // Cleanup method to dispose resources (could be improved)
    dispose() {
        while (this.children.length) {
            this.remove(this.children[0]);
        }
    }
}

export default SeedScene;
