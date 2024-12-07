import * as THREE from 'three';

// checkerboard
export function createCheckerboardTexture(color1, color2) {
    const size = 512;
    const squares = 8;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    const squareSize = size / squares;

    // Draw the checkerboard pattern
    for (let y = 0; y < squares; y++) {
        for (let x = 0; x < squares; x++) {
            context.fillStyle =
                (x + y) % 2 === 0
                    ? `#${color1.getHexString()}`
                    : `#${color2.getHexString()}`;
            context.fillRect(
                x * squareSize,
                y * squareSize,
                squareSize,
                squareSize
            );
        }
    }

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
        map: texture,
    });
}

// Create a canvas for the stripe texture
export function createStripeTexture(color1, color2, isVertical) {
    const size = 512;
    const stripes = 8;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    const stripeSize = size / stripes;

    // Draw the stripes
    for (let i = 0; i < stripes; i++) {
        context.fillStyle =
            i % 2 === 0
                ? `#${color1.getHexString()}`
                : `#${color2.getHexString()}`;
        if (isVertical) {
            context.fillRect(i * stripeSize, 0, stripeSize, size); // Vertical stripes
        } else {
            context.fillRect(0, i * stripeSize, size, stripeSize); // Horizontal stripes
        }
    }

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
        map: texture,
    });
}

// ShaderMaterial with zebra pattern
export function createZebraTexture(color1, color2, rand) {
    const size = 512;
    const frequency = 50.0;
    const irregularity = 3.0 + 3.0 * rand;
    const noiseScale = 3.0 + 3.0 * rand;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    // Noise function
    function randomNoise(x, y) {
        return (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123) % 1;
    }

    function noise(x, y) {
        const iX = Math.floor(x);
        const iY = Math.floor(y);
        const fX = x - iX;
        const fY = y - iY;

        const a = randomNoise(iX, iY);
        const b = randomNoise(iX + 1, iY);
        const c = randomNoise(iX, iY + 1);
        const d = randomNoise(iX + 1, iY + 1);

        const uX = fX * fX * (3.0 - 2.0 * fX);
        const uY = fY * fY * (3.0 - 2.0 * fY);

        return (
            a * (1.0 - uX) * (1.0 - uY) +
            b * uX * (1.0 - uY) +
            c * (1.0 - uX) * uY +
            d * uX * uY
        );
    }

    // Generate zebra pattern
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const vUvX = x / size;
            const vUvY = y / size;

            const distortion =
                noise(vUvX * noiseScale, vUvY * noiseScale) * irregularity;
            const wave = Math.sin(vUvY * frequency + distortion);
            const stripes = (wave * 0.5 + 0.5) % 1.0 > 0.5 ? 1 : 0;

            context.fillStyle = stripes
                ? `#${color1.getHexString()}`
                : `#${color2.getHexString()}`;
            context.fillRect(x, y, 1, 1);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
        map: texture,
    });
}
