import { Group, Color } from 'three';
import * as THREE from 'three';

class Level extends Group {
    // check if needs parent constructor
    constructor(levelNum) {
        super();

        let primitives = 3 + Math.floor(levelNum / 3);

        this.state = {
            texture: null,
            offset: (110 - Math.floor(levelNum / 3) * 10) / 255,
            numPrim: primitives,
            answer: Math.floor(Math.random() * primitives),
            primTypes: ['box', 'sphere', 'cylinder', 'cone'],
            texture: [],
        };
    }

    getOffset() {
        return Math.floor(this.state.offset * 255);
    }

    getBoxes() {
        return this.state.numPrim;
    }

    getTexture() {
        return this.state.texture;
    }

    checkAnswer(input) {
        return input == this.state.answer;
    }
}

export default Level;
