import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Cube, Floor, Box } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            // TO-DO: Adjust rotation speed here. Remove from GUI or leave in?
            rotationSpeed: 1,
            updateList: [],
            level: 1,
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // TO-DO: Loading issue: more than 5 boxes causes it not to load
        // let level = {
        //     texture: null,
        //     offset: (110 - ((Math.floor(this.state.level / 3)) * 10)) / 255,
        //     numBoxes: 3 + (Math.floor(this.state.level / 3))
        // }

        // console.log(level)

        // Empirically, 20 is difficult but possible. 10 is hard, but *mostly* possible.
        // this.colorOffset = 8 / 255;

        // Add meshes to scene
        const lights = new BasicLights();
        const floor = new Floor();
        // const box = new Box(this, level.numBoxes, level.offset, level.texture);
        const box = new Box(this);

        this.add(lights, floor, box);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
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
}

export default SeedScene;
