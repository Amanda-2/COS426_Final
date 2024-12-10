import { Group, Color } from 'three';
import * as THREE from 'three';

class Level extends Group {
    // check if needs parent constructor
    constructor(levelNum) {
        super();

        let primitiveTypes = ['box', 'sphere', 'cylinder', 'cone']
        let textures = ['checkerboard', 'stripes', 'zebra']

        let primitives = 3 + Math.floor(levelNum / 3);
        let numberTextures = Math.min(1 + Math.floor(levelNum / 4), textures.length);
        let numberPrimTypes = Math.min(1 + Math.floor(levelNum / 5), primitiveTypes.length)

        this.state = {
            texture: null,
            offset: (110 - Math.floor(levelNum / 3) * 10) / 255,
            numPrim: primitives,
            answer: Math.floor(Math.random() * primitives),
            primTypes: this.selectRandom(primitiveTypes, numberPrimTypes),
            texture: this.selectRandom(textures, numberTextures),
        };
    }

    selectRandom(list, number) {
        let randoms = [...list]
        while (randoms.length > number) {
            let selectedIndex = Math.floor(Math.random() * (randoms.length))
            let front = randoms.slice(0, selectedIndex)
            let back = randoms.slice(selectedIndex + 1)
            randoms = [...front, ...back]
        }

        return randoms
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
        return (input == this.state.answer);
    }
}

export default Level;
