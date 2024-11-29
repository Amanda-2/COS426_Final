import { Group } from 'three';
import * as THREE from 'three';

class Box extends Group {
    constructor(n) {
        super();

        this.name = 'box';

        //TO-DO: color algorithm
        const palette = [0x3d405b, 0x656d4a, 0x967aa1];

        const placedPositions = [];
        const boxSize = 2;
        const spacing = 3;

        for (let i = 0; i < n; i++) {
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
}

export default Box;
