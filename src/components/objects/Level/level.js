import { Group, Color } from 'three';
import * as THREE from 'three';

class Level extends Group {
    // check if needs parent constructor
    constructor(
        levelNum
    ) {
        super();

        let boxes = 3 + (Math.floor(levelNum / 3))

        this.state = {
            texture: null,
            offset: (110 - ((Math.floor(levelNum / 3)) * 10)) / 255,
            numBoxes: boxes,
            answer: Math.floor(Math.random() * (boxes))
        }
    }

    getOffset() {
        return Math.floor(this.state.offset * 255);
    }

    getBoxes() {
        return this.state.numBoxes;
    }

    getTexture() {
        return this.state.texture;
    }

    checkAnswer(input) {
        return (input == this.state.answer);
    }
}

export default Level;
