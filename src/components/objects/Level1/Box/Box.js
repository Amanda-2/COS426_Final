import { Group, Color } from 'three';
import * as THREE from 'three';

class Box extends Group {
    constructor(
        parent,
        numBoxes,
        colorOffset,
        texture
    ) {
        super();

        this.state = {
            gui: parent.state.gui,
            check: (() => this.checkAnswer()),
            level: 1
        }

        this.texture = null;
        this.colorOffset = (110 - ((Math.floor(this.state.level / 3)) * 10)) / 255;
        this.numBoxes = 3 + (Math.floor(this.state.level / 3))

        this.name = 'box';

        //TO-DO: color algorithm
        this.answer = Math.floor(Math.random() * (this.numBoxes))
        console.log("ANSWER: ", this.answer)
        let palette = [];
        let color = [
                    (Math.floor(Math.random() * (255 - (this.colorOffset * 255) + 1))) / 255,
                    (Math.floor(Math.random() * (255 - (this.colorOffset * 255)+ 1))) / 255,
                    (Math.floor(Math.random() * (255 - (this.colorOffset * 255)+ 1))) / 255
                ]
        color = new Color(color[0], color[1], color[2])
        let answerColor = color.clone().addScalar(this.colorOffset)

        for (let k = 0; k < this.numBoxes; k++) {
            if (k == this.answer) {
                console.log("got here")
                palette[k] = answerColor
            } else {
                palette[k] = color
            } 
        }

        const placedPositions = [];
        const boxSize = 2;
        const spacing = 3;

        for (let i = 0; i < this.numBoxes; i++) {
            let position;
            const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
            const material = new THREE.MeshStandardMaterial({
                color: palette[i],
            });
            const box = new THREE.Mesh(geometry, material);

            do {
                position = {
                    x: Math.random() * 10 - 5,
                    z: Math.random() * 10 - 5,
                };
            } while (
                this.checkCollision(
                    position,
                    placedPositions,
                    boxSize + spacing
                )
            );
            placedPositions.push(position);
            box.position.set(position.x, boxSize / 2, position.z);

            box.castShadow = true;
            box.receiveShadow = true;

            this.add(box);
        }

        this.state.gui.add(this.state, 'check')
    }

    checkCollision(newPosition, placedPositions, minDistance) {
        for (const pos of placedPositions) {
            const distance = Math.sqrt(
                (newPosition.x - pos.x) ** 2 + (newPosition.z - pos.z) ** 2
            );
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }

    checkAnswer() {
        this.state.level += 1
    }
}

export default Box;
