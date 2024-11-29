import { Group } from 'three';
import * as THREE from 'three';

class Floor extends Group {
    constructor() {
        super();

        this.name = 'floor';

        const geometry = new THREE.CircleGeometry(50, 50);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;

        plane.receiveShadow = true;

        this.add(plane);
    }
}

export default Floor;
