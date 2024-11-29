import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
} from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const spot = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 0.5);
        const dir = new DirectionalLight(0xffffff, 1);
        dir.position.set(10, 10, 0);
        dir.castShadow = true;
        hemi.castShadow = true;

        this.add(ambi, dir, hemi);
    }
}

export default BasicLights;
