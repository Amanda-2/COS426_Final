import { Group, Color } from 'three';
import * as THREE from 'three';
import {
    createCheckerboardTexture,
    createStripeTexture,
    createZebraTexture,
} from './textures.js';

class Primitive extends Group {
    // check if needs parent constructor
    constructor(parent, answer, numPrim, colorOffset, primTypes, texture) {
        super();

        this.state = {
            temp: 32,
        };

        this.name = 'primitive';

        //TO-DO: color algorithm
        let palette = [];
        let color = [
            Math.floor(Math.random() * (255 - colorOffset * 255 + 1)) / 255,
            Math.floor(Math.random() * (255 - colorOffset * 255 + 1)) / 255,
            Math.floor(Math.random() * (255 - colorOffset * 255 + 1)) / 255,
        ];
        color = new Color(color[0], color[1], color[2]);
        let answerColor = color.clone().addScalar(colorOffset);

        for (let k = 0; k < numPrim; k++) {
            if (k == answer) {
                palette[k] = answerColor;
            } else {
                palette[k] = color;
            }
        }

        // Placement parameters (adjust these to increase max number of boxes)
        const initialSize = 3;
        const minSize = 0.5;
        const spacing = 0.2;
        const spawnRadius = 5;
        const maxAttempts = 50;

        let size = initialSize;
        let successfulPlacement = false;

        const primitives = new Map([
            [
                'box',
                {
                    primSize: (size) => size / Math.sqrt(2),
                    yposition: (primSize) => primSize / 2,
                    geometry: (primSize) =>
                        new THREE.BoxGeometry(primSize, primSize, primSize),
                },
            ],
            [
                'sphere',
                {
                    primSize: (size) => size / 2,
                    yposition: (primSize) => primSize,
                    geometry: (primSize) =>
                        new THREE.SphereGeometry(primSize, 64, 32),
                },
            ],
            [
                'cylinder',
                {
                    primSize: (size) => size / Math.sqrt(2),
                    yposition: (primSize) => primSize / 2,
                    geometry: (primSize) =>
                        new THREE.CylinderGeometry(
                            primSize / 2,
                            primSize / 2,
                            primSize,
                            64
                        ),
                },
            ],
            [
                'cone',
                {
                    primSize: (size) => size / Math.sqrt(2),
                    yposition: (primSize) => primSize / 2,
                    geometry: (primSize) =>
                        new THREE.ConeGeometry(primSize / 2, primSize, 64),
                },
            ],
        ]);

        while (!successfulPlacement && size >= minSize) {
            const cellSize = size + spacing;
            const placedPositions = [];
            const hash = new Map();
            let allPlaced = true;

            for (let i = 0; i < numPrim; i++) {
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
                        return distance < size;
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

                // Place primitives
                placedPositions.forEach((pos, i) => {
                    const box = primitives.get(primTypes[i % primTypes.length]);
                    const primSize = box.primSize(size);
                    const geometry = box.geometry(primSize);
                    const primyPos = box.yposition(primSize);
                    let material = new THREE.MeshStandardMaterial({
                        color: palette[i % palette.length],
                    });
                    // create alternate color
                    if (texture.length > 0) {
                        const color1 = palette[i % palette.length];
                        const color2 = new Color(1, 1, 1).sub(color1);
                        const textureType = texture[i % texture.length];
                        if (textureType == 'checkerboard') {
                            material = createCheckerboardTexture(
                                color1,
                                color2
                            );
                        } else if (textureType == 'stripes') {
                            material = createStripeTexture(
                                color1,
                                color2,
                                Math.random() < 0.5
                            );
                        } else if (textureType == 'zebra') {
                            material = createZebraTexture(
                                color1,
                                color2,
                                Math.random()
                            );
                        }
                    }
                    const primitive = new THREE.Mesh(geometry, material);
                    primitive.position.set(pos.x, primyPos, pos.z);
                    primitive.rotation.set(0, Math.random() * Math.PI, 0);
                    primitive.castShadow = true;
                    primitive.receiveShadow = true;
                    this.add(primitive);

                    // Create canvas for text floating on top of cubes
                    const sprite = this.createNumberLabel(i, pos, size);
                    this.add(sprite);
                });
            } else {
                // Reduce primitive size and try again
                size = Math.max(size - 0.1, minSize);
                console.warn(
                    `Reducing primitive size to ${size} to fit all boxes.`
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

    // create number label sprite
    createNumberLabel(label, pos, size) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.shadowColor = 'white';
        context.shadowBlur = 5;
        context.font = `${20 * size}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(pos.x, size * 1.1, pos.z);
        sprite.scale.set(1.5, 0.75, 1);
        return sprite;
    }

    checkAnswer(answer) {
        if (answer == this.answer) {
            this.state.level += 1;
        } else {
            window.alert("Oops! That's not the correct answer.");
        }
    }
}

export default Primitive;
