import {
    Group,
    SpotLight,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    CameraHelper,
} from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);
        const d = 10;

        const ambi = new AmbientLight(0x404040, 1.8);
        const dir = new DirectionalLight(0xffffff, 1);
        dir.position.set(10, 10, 0);
        dir.shadow.camera.left = -d;
        dir.shadow.camera.right = d;
        dir.shadow.camera.top = d;
        dir.shadow.camera.bottom = -d;
        dir.shadow.mapSize.width = 512;
        dir.shadow.mapSize.height = 512;
        dir.shadow.camera.near = 1;
        dir.shadow.camera.far = 1000;
        dir.shadow.camera.fov = 100;
        dir.castShadow = true;

        this.add(ambi, dir);
    }
}

export default BasicLights;
