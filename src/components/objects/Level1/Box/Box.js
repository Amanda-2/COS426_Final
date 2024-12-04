import { Group, Color } from 'three';
import * as THREE from 'three';

class Box extends Group {
    // check if needs parent constructor
    constructor(
        parent,
        answer,
        numBoxes,
        colorOffset
    ) {
        super();

        this.state = {
            temp: 32
        }

        this.name = 'box';

        //TO-DO: color algorithm
        let palette = [];
        let color = [
                    (Math.floor(Math.random() * (255 - (colorOffset * 255) + 1))) / 255,
                    (Math.floor(Math.random() * (255 - (colorOffset * 255)+ 1))) / 255,
                    (Math.floor(Math.random() * (255 - (colorOffset * 255)+ 1))) / 255
                ]
        color = new Color(color[0], color[1], color[2])
        let answerColor = color.clone().addScalar(colorOffset)

        for (let k = 0; k < numBoxes; k++) {
            if (k == answer) {
                palette[k] = answerColor
            } else {
                palette[k] = color
            } 
        }

        // Box placement parameters (adjust these to increase max number of boxes)
        const initialBoxSize = 2;
        const minBoxSize = 0.5;
        const spacing = 0.2;
        const spawnRadius = 5;
        const maxAttempts = 50;

        let boxSize = initialBoxSize;
        let successfulPlacement = false;

        while (!successfulPlacement && boxSize >= minBoxSize) {
            const boxDiag = Math.sqrt(2) * boxSize;
            const cellSize = boxDiag + spacing;
            const placedPositions = [];
            const hash = new Map();
            let allPlaced = true;

            for (let i = 0; i < n; i++) {
                let position;
                let attempts = 0;

                do {
                    position = {
                        x: Math.random() * 2 * spawnRadius - spawnRadius,
                        z: Math.random() * 2 * spawnRadius - spawnRadius,
                    };
                    attempts++;

                    // Compute hash cell coordinates
                    const cellKey = this.hashKey(position, cellSize);
                    if (hash.has(cellKey)) continue;

                    // Check collisions in neighboring cells
                    const neighbors = this.getNeighbors(cellKey, hash);
                    const collision = neighbors.some((neighbor) => {
                        const distance = Math.sqrt(
                            (position.x - neighbor.x) ** 2 +
                                (position.z - neighbor.z) ** 2
                        );
                        return distance < boxDiag;
                    });

                    if (!collision) {
                        hash.set(cellKey, position); // Store position in hash
                        placedPositions.push(position);
                        break;
                    }
                } while (attempts < maxAttempts);

                if (attempts >= maxAttempts) {
                    allPlaced = false;
                    break;
                }
            }

            if (allPlaced) {
                successfulPlacement = true;

                // Place boxes
                placedPositions.forEach((pos, i) => {
                    const geometry = new THREE.BoxGeometry(
                        boxSize,
                        boxSize,
                        boxSize
                    );
                    const material = new THREE.MeshStandardMaterial({
                        color: palette[i % palette.length],
                    });
                    const box = new THREE.Mesh(geometry, material);
                    box.position.set(pos.x, boxSize / 2, pos.z);
                    // Add random rotation
                    box.rotation.set(0, Math.random() * Math.PI, 0);
                    box.castShadow = true;
                    box.receiveShadow = true;
                    this.add(box);

                    // Create canvas for text floating on top of cubes
                    const canvas = document.createElement('canvas');
                    canvas.width = 256;
                    canvas.height = 128;
                    const context = canvas.getContext('2d');
                    context.fillStyle = 'black';
                    context.font = '50px Arial';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(i, canvas.width / 2, canvas.height / 2);
                    const texture = new THREE.CanvasTexture(canvas);
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                    });
                    const sprite = new THREE.Sprite(spriteMaterial);
                    sprite.position.set(pos.x, boxSize + 0.5, pos.z);
                    sprite.scale.set(1.5, 0.75, 1);
                    this.add(sprite);
                    // Create plane geometry for text on floor
                    const planeGeometry = new THREE.PlaneGeometry(3, 1.5);
                    const planeMaterial = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                    });
                    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                    plane.position.set(
                        pos.x - boxSize / 2,
                        0.01,
                        pos.z - boxSize / 2
                    );
                    plane.rotation.x = -Math.PI / 2;
                    this.add(plane);
                });
            } else {
                // Reduce box size and try again
                boxSize = Math.max(boxSize - 0.1, minBoxSize);
                console.warn(
                    `Reducing box size to ${boxSize} to fit all boxes.`
                );
            }
        }

        // Log a warning if placement was unsuccessful
        if (!successfulPlacement) {
            console.warn(
                `Could not place all boxes. Only placed ${this.children.length} boxes.`
            );
        }
    }

    // Compute hash key for a position
    hashKey(position, cellSize) {
        return `${Math.floor(position.x / cellSize)},${Math.floor(
            position.z / cellSize
        )}`;
    }

    // Get neighboring cells for collision check
    getNeighbors(cellKey, hash) {
        const [x, z] = cellKey.split(',').map(Number);
        const neighbors = [];

        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const neighborKey = `${x + dx},${z + dz}`;
                if (hash.has(neighborKey)) {
                    neighbors.push(hash.get(neighborKey));
                }
            }
        }

        return neighbors;
    }

    checkAnswer(answer) {
        if (answer == this.answer) {
            this.state.level += 1
        } else {
            window.alert("Oops! That's not the correct answer.")
        }
    }
}

export default Box;
