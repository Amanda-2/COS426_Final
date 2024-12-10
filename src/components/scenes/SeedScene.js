import * as Dat from 'dat.gui';
import { Scene, Color, Raycaster, Vector2 } from 'three';
import { Flower, Land, Cube, Floor, Skybox, Primitive, Level } from 'objects';
import { BasicLights } from 'lights';
import { createControls } from './createControls.js';
// import { Level } from "level";

class SeedScene extends Scene {
    constructor(quitCallback, camera) {
        // Call parent Scene() constructor
        super();

        // let temp = new Level();
        this.camera = camera;
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.selectedObject = null;

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            // TO-DO: Adjust rotation speed here. Remove from GUI or leave in?
            rotationSpeed: 1,
            updateList: [],
            levelNumber: 1,
            level: new Level(1),
        };

        this.stats = {
            score: 0,
            times: [],
            minTime: null,
            maxTime: null,
            offsets: [],
            minOffset: 0,
        };

        this.startTime = new Date();

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Empirically, 20 is difficult but possible. 10 is hard, but *mostly* possible.
        this.colorOffset = 8 / 255;

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
            () => this.newSeedScene() // Regenerate callback
        );

        this.updateLevelDisplay(this.state.levelNumber);
        window.addEventListener('mousemove', (event) =>
            this.onPointerMove(event)
        );
    }

    onPointerMove(event) {
        // Convert mouse position to normalized device coordinates (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const interactiveObjects = [];
        this.traverse((child) => {
            if (child.name === 'primitive') {
                interactiveObjects.push(child);
            }
        });

        const intersects = this.raycaster.intersectObjects(interactiveObjects);

        // Reset highlight for previously selected object
        if (
            this.selectedObject &&
            this.selectedObject.material &&
            'emissive' in this.selectedObject.material
        ) {
            this.selectedObject.material.emissive.set(0x000000);
            this.selectedObject = null;
        }

        // Highlight the first intersected object
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (
                intersectedObject.material &&
                'emissive' in intersectedObject.material
            ) {
                this.selectedObject = intersectedObject;
                this.selectedObject.material.emissive.set(0xff0000); // Highlight color
            }
        }

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
        this.updateStats();
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
        let levelTime = Date.now() - this.startTime;
        let thisOffset = this.state.level.getOffset();
        this.stats.times.push(levelTime);
        this.stats.times.sort();
        this.stats.maxTime =
            this.stats.times[this.stats.times.length - 1] / 1000;
        this.stats.minTime = this.stats.times[0] / 1000;
        this.stats.offsets.push(thisOffset);
        this.stats.offsets.sort();
        this.minOffset = this.stats.offsets[this.stats.offsets.length - 1];

        this.stats.score = Math.ceil(
            this.stats.score + (1000 / levelTime) * (100 / thisOffset) * 1000
        );
    }

    changeLevel(newLevel) {
        this.state.levelNumber = newLevel;
        this.state.level = new Level(newLevel);
        this.updateLevelDisplay(newLevel);

        this.newSeedScene();
    }
}

export default SeedScene;
