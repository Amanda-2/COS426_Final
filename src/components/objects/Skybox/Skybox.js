import { Group } from 'three';
import * as THREE from 'three';
import sky from './textures/sky.png';

class Skybox extends Group {
    constructor() {
        super();

        this.name = 'skybox';
        const geometry = new THREE.SphereGeometry(100, 100, 100);
        geometry.scale(-1, 1, 1);

        const texture = new THREE.TextureLoader().load(sky);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
    }
}

export default Skybox;
