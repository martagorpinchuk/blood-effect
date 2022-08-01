/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/Blood.ts":
/*!******************************!*\
  !*** ./src/scripts/Blood.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BloodGfx = void 0;
const three_2 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const BloodSplatter_1 = __webpack_require__(/*! ./BloodSplatter */ "./src/scripts/BloodSplatter.ts");
const GroundBloodSplatter_1 = __webpack_require__(/*! ./GroundBloodSplatter */ "./src/scripts/GroundBloodSplatter.ts");
//
class BloodGfx {
    constructor(fadingCoef, timeCoef) {
        this.elapsedTimeBlood = 0;
        this.wrapper = new three_2.Object3D();
        this.clock = new three_2.Clock();
        this.addBloodSplatter();
        this.addGroundBloodSplatter();
        this.wrapper.add(this.bloodSplatter.wrapper);
        this.wrapper.add(this.groundBloodSplatter.wrapper);
    }
    ;
    addBloodSplatter() {
        this.bloodSplatter = new BloodSplatter_1.BloodSplatter();
    }
    ;
    addGroundBloodSplatter() {
        this.groundBloodSplatter = new GroundBloodSplatter_1.GroundBloodSplatter(this.bloodSplatter.splashPositionX, this.bloodSplatter.splashPositionZ);
    }
    ;
    update(elapsedTime, fadingCoef, timeCoef) {
        this.bloodSplatter.update(elapsedTime, timeCoef);
        if (this.bloodSplatter.bloodDisappear) {
            this.delta = this.clock.getDelta() * 1000;
            this.elapsedTimeBlood += this.delta;
            this.groundBloodSplatter.update(elapsedTime, this.bloodSplatter.splashPositionX, this.bloodSplatter.splashPositionZ, this.bloodSplatter.newSize);
            this.groundBloodSplatter.material.uniforms.uVisibility.value = 1.0;
            this.groundBloodSplatter.material.uniforms.uFading.value = this.elapsedTimeBlood * 0.001 * fadingCoef;
            // for ( let i = 0; i < this.groundBloodSplatter.numberOfBloodDrops; i ++ ) {
            //     let size = this.bloodSplatter.geometry.attributes.size.getX( i ) + elapsedTime * 0.0002 + 0.1;
            //     this.groundBloodSplatter.geometry.attributes.size.setX( i, size );
            // };
        }
        ;
        // this.groundBloodSplatter.geometry.attributes.size.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow1.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow2.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow3.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow4.needsUpdate = true;
    }
    ;
}
exports.BloodGfx = BloodGfx;
;


/***/ }),

/***/ "./src/scripts/BloodSplatter.ts":
/*!**************************************!*\
  !*** ./src/scripts/BloodSplatter.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BloodSplatter = void 0;
const three_4 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const BloodSplatter_Shader_1 = __webpack_require__(/*! ./shaders/BloodSplatter.Shader */ "./src/scripts/shaders/BloodSplatter.Shader.ts");
//
class BloodSplatter {
    constructor() {
        this.wrapper = new three_4.Object3D();
        this.elapsedTimeFall = 0;
        this.bloodDisappear = false;
        this.numberOfBloodDrops = 5;
        this.positions = [];
        this.velocity = [];
        this.size = [];
        this.colorCoef = [];
        this.shape = [];
        this.bloodOpacity = [];
        this.splashPositionX = [];
        this.splashPositionZ = [];
        this.paneSize = 0.1;
        this.newSize = [];
        this.generate();
        this.clock = new three_4.Clock();
    }
    ;
    generate() {
        if (this.mesh) {
            this.geometry.dispose();
            this.wrapper.remove(this.mesh);
        }
        this.geometry = new three_4.InstancedBufferGeometry();
        this.material = new BloodSplatter_Shader_1.BloodSplatterMaterial();
        this.mesh = new three_4.Mesh(this.geometry, this.material);
        if (this.mesh) {
            this.geometry.dispose();
            this.wrapper.remove(this.mesh);
        }
        const transformRow1 = [];
        const transformRow2 = [];
        const transformRow3 = [];
        const transformRow4 = [];
        for (let i = 0; i < this.numberOfBloodDrops; i++) {
            this.rotationX = 0;
            this.rotationY = Math.PI / 3;
            this.rotationZ = 0;
            let positionX = Math.random();
            let positionY = 1;
            let positionZ = Math.random();
            let transformMatrix = new three_4.Matrix4().compose(new three_4.Vector3(positionX, positionY, positionZ), new three_4.Quaternion().setFromEuler(new three_4.Euler(this.rotationX, this.rotationY, this.rotationZ)), new three_4.Vector3(0.5, 0.5, 0.5)).toArray();
            transformRow1.push(transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3]);
            transformRow2.push(transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7]);
            transformRow3.push(transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11]);
            transformRow4.push(transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15]);
            this.velocity.push(Math.random() * 9, (Math.random() + 0.5) * 8, Math.random() * 9);
            this.size.push(Math.random() * 0.1);
            this.colorCoef.push((Math.random() + 0.5) * 1.4);
            this.shape.push(Math.random() * 0.5);
            this.bloodOpacity.push(1);
        }
        this.positions = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        const uv = [
            0, 0,
            1, 0,
            1, 1,
            1, 1,
            0, 1,
            0, 0
        ];
        this.geometry.setAttribute('position', new three_4.Float32BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('uv', new three_4.Float32BufferAttribute(uv, 2));
        this.geometry.setAttribute('transformRow1', new three_4.InstancedBufferAttribute(new Float32Array(transformRow1), 4));
        this.geometry.setAttribute('transformRow2', new three_4.InstancedBufferAttribute(new Float32Array(transformRow2), 4));
        this.geometry.setAttribute('transformRow3', new three_4.InstancedBufferAttribute(new Float32Array(transformRow3), 4));
        this.geometry.setAttribute('transformRow4', new three_4.InstancedBufferAttribute(new Float32Array(transformRow4), 4));
        this.geometry.setAttribute('velocity', new three_4.InstancedBufferAttribute(new Float32Array(this.velocity), 3));
        this.geometry.setAttribute('size', new three_4.InstancedBufferAttribute(new Float32Array(this.size), 1));
        this.geometry.setAttribute('colorCoef', new three_4.InstancedBufferAttribute(new Float32Array(this.colorCoef), 1));
        this.geometry.setAttribute('shape', new three_4.InstancedBufferAttribute(new Float32Array(this.shape), 1));
        this.geometry.setAttribute('bloodOpacity', new three_4.InstancedBufferAttribute(new Float32Array(this.bloodOpacity), 1));
        this.wrapper.add(this.mesh);
    }
    ;
    update(elapsedTime, timeCoef) {
        this.material.uniforms.uTime.value = elapsedTime;
        this.timeOfFall = this.clock.getDelta() * 1000;
        this.elapsedTimeFall += this.timeOfFall;
        for (let i = 0; i < this.numberOfBloodDrops; i++) {
            let newPositionX = this.geometry.attributes.transformRow4.getX(i);
            let newPositionY = this.geometry.attributes.transformRow4.getY(i);
            let newPositionZ = this.geometry.attributes.transformRow4.getZ(i);
            let velocityX = this.geometry.attributes.velocity.getX(i) * 0.1;
            let velocityY = this.geometry.attributes.velocity.getY(i) * 0.1;
            let velocityZ = this.geometry.attributes.velocity.getZ(i) * 0.1;
            let size = this.geometry.attributes.size.getX(i); // + 0.01;
            if (newPositionY > 0.0) {
                newPositionX += -velocityX * this.elapsedTimeFall * 0.00004 * timeCoef;
                newPositionY += -velocityY * this.elapsedTimeFall * 0.00004 * timeCoef;
                newPositionZ += -velocityZ * this.elapsedTimeFall * 0.00004 * timeCoef;
                size += 0.01;
            }
            else {
                newPositionY = 0;
                this.newSize[i] = size;
            }
            if (+newPositionY.toFixed(1) == 0) {
                // newPositionY = 0;
                this.geometry.attributes.bloodOpacity.setX(i, 0);
                this.geometry.attributes.bloodOpacity.needsUpdate = true;
                this.bloodDisappear = true;
                this.splashPositionX[i] = newPositionX;
                this.splashPositionZ[i] = newPositionZ;
                // this.newSize[ i ] = size;
            }
            this.geometry.attributes.transformRow4.setX(i, newPositionX);
            this.geometry.attributes.transformRow4.setY(i, newPositionY);
            this.geometry.attributes.transformRow4.setZ(i, newPositionZ);
            this.geometry.attributes.size.setX(i, size);
            this.geometry.attributes.transformRow1.needsUpdate = true;
            this.geometry.attributes.transformRow2.needsUpdate = true;
            this.geometry.attributes.transformRow3.needsUpdate = true;
            this.geometry.attributes.transformRow4.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
        }
    }
    ;
}
exports.BloodSplatter = BloodSplatter;
;


/***/ }),

/***/ "./src/scripts/GroundBloodSplatter.ts":
/*!********************************************!*\
  !*** ./src/scripts/GroundBloodSplatter.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroundBloodSplatter = void 0;
const three_3 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const GroundBloodSplatter_Shader_1 = __webpack_require__(/*! ./shaders/GroundBloodSplatter.Shader */ "./src/scripts/shaders/GroundBloodSplatter.Shader.ts");
//
class GroundBloodSplatter {
    constructor(splashPositionX, splashPositionZ) {
        this.wrapper = new three_3.Object3D();
        this.numberOfBloodDrops = 5;
        this.positions = [];
        this.size = [];
        this.colorCoef = [];
        this.shape = [];
        this.noiseFade = [];
        this.generate(splashPositionX, splashPositionZ);
    }
    ;
    generate(splashPositionX, splashPositionZ) {
        if (this.mesh) {
            this.geometry.dispose();
            this.wrapper.remove(this.mesh);
        }
        this.geometry = new three_3.InstancedBufferGeometry();
        this.material = new GroundBloodSplatter_Shader_1.GroundBloodSplatterMaterial();
        this.mesh = new three_3.Mesh(this.geometry, this.material);
        const transformRow1 = [];
        const transformRow2 = [];
        const transformRow3 = [];
        const transformRow4 = [];
        // this.size = size;
        // console.log( this.size );
        for (let i = 0; i < this.numberOfBloodDrops; i++) {
            let rotationX = -Math.PI / 2;
            let rotationY = 0;
            let rotationZ = 0;
            let positionX = 1;
            let positionY = 0.01;
            let positionZ = 1;
            let transformMatrix = new three_3.Matrix4().compose(new three_3.Vector3(positionX, positionY, positionZ), new three_3.Quaternion().setFromEuler(new three_3.Euler(rotationX, rotationY, rotationZ)), new three_3.Vector3(0.4, 0.4, 0.4)).toArray();
            transformRow1.push(transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3]);
            transformRow2.push(transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7]);
            transformRow3.push(transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11]);
            transformRow4.push(transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15]);
            this.size.push(0);
            this.colorCoef.push((Math.random() + 0.5) * 1.4);
            this.shape.push(Math.random());
        }
        this.positions = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        const uv = [
            0, 0,
            1, 0,
            1, 1,
            1, 1,
            0, 1,
            0, 0
        ];
        this.geometry.setAttribute('position', new three_3.Float32BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('uv', new three_3.Float32BufferAttribute(uv, 2));
        this.geometry.setAttribute('transformRow1', new three_3.InstancedBufferAttribute(new Float32Array(transformRow1), 4));
        this.geometry.setAttribute('transformRow2', new three_3.InstancedBufferAttribute(new Float32Array(transformRow2), 4));
        this.geometry.setAttribute('transformRow3', new three_3.InstancedBufferAttribute(new Float32Array(transformRow3), 4));
        this.geometry.setAttribute('transformRow4', new three_3.InstancedBufferAttribute(new Float32Array(transformRow4), 4));
        this.geometry.setAttribute('size', new three_3.InstancedBufferAttribute(new Float32Array(this.size), 1));
        this.geometry.setAttribute('colorCoef', new three_3.InstancedBufferAttribute(new Float32Array(this.colorCoef), 1));
        this.geometry.setAttribute('shape', new three_3.InstancedBufferAttribute(new Float32Array(this.shape), 1));
        this.wrapper.add(this.mesh);
    }
    ;
    update(elapsedTime, splashPositionX, splashPositionZ, size) {
        this.material.uniforms.uTime = elapsedTime;
        for (let i = 0; i < this.numberOfBloodDrops; i++) {
            let newPositionX;
            let newPositionZ;
            let newSize;
            newPositionX = splashPositionX[i];
            newPositionZ = splashPositionZ[i];
            newSize = size[i] * 0.9; // / this.geometry.attributes.shape.getX( i );// * 1.9;
            this.geometry.attributes.transformRow4.setX(i, newPositionX);
            this.geometry.attributes.transformRow4.setZ(i, newPositionZ);
            // this.geometry.attributes.size.setX( i, newSize + elapsedTime * 0.0002 );
            this.geometry.attributes.size.setX(i, newSize);
            this.geometry.attributes.transformRow1.needsUpdate = true;
            this.geometry.attributes.transformRow2.needsUpdate = true;
            this.geometry.attributes.transformRow3.needsUpdate = true;
            this.geometry.attributes.transformRow4.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
        }
    }
    ;
}
exports.GroundBloodSplatter = GroundBloodSplatter;
;


/***/ }),

/***/ "./src/scripts/index.ts":
/*!******************************!*\
  !*** ./src/scripts/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const three_1 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const OrbitControls_js_1 = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
const Blood_1 = __webpack_require__(/*! ./Blood */ "./src/scripts/Blood.ts");
const tweakpane_1 = __webpack_require__(/*! tweakpane */ "./node_modules/tweakpane/dist/tweakpane.js");
//
class Main {
    constructor() {
        this.elapsedTime = 0;
        this.fadingCoef = 1;
        this.timeCoef = 1;
        this.sizes = {
            width: 0,
            height: 0
        };
        this.tick = () => {
            window.requestAnimationFrame(this.tick);
            this.delta = this.clock.getDelta() * 1000;
            this.elapsedTime += this.delta;
            if (this.sizes.width !== window.innerWidth || this.sizes.height !== window.innerHeight) {
                this.resize();
            }
            if (this.bloodGfx)
                this.bloodGfx.update(this.elapsedTime, this.fadingCoef, this.timeCoef);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            if (Math.round(this.elapsedTime) > 3500) {
                this.createBlood();
                this.elapsedTime = 0;
                this.bloodGfx.elapsedTimeBlood = 0;
                this.bloodGfx.bloodSplatter.elapsedTimeFall = 0;
            }
        };
        this.init();
        console.log('loaded!');
    }
    ;
    init() {
        // Canvas
        this.canvas = document.querySelector('canvas.webglView');
        // Scene
        this.scene = new three_1.Scene();
        this.scene.background = new three_1.Color('#b3afbd');
        // Sizes
        this.sizes.width = window.innerWidth,
            this.sizes.height = window.innerHeight;
        // Camera
        this.camera = new three_1.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(3.3, 2.1, 0);
        this.scene.add(this.camera);
        const ambientLight = new three_1.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        // Controls
        this.controls = new OrbitControls_js_1.MapControls(this.camera, this.canvas);
        // Renderer
        this.renderer = new three_1.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Plane
        let planeGeometry = new three_1.PlaneBufferGeometry(6.5, 6.5, 1, 1);
        let planeMaterial = new three_1.MeshBasicMaterial({ color: '#818891' });
        this.plane = new three_1.Mesh(planeGeometry, planeMaterial);
        this.plane.position.y = 0;
        this.plane.rotation.x -= Math.PI / 2;
        this.plane.rotation.z -= Math.PI / 4;
        this.scene.add(this.plane);
        //
        const light = new three_1.PointLight(0xe9f7ec, 1, 500);
        light.position.set(2, 2, 2);
        this.scene.add(light);
        // Cube
        let cubeGeom = new three_1.BoxBufferGeometry(0.25, 0.95, 0.25);
        let cubeMaterial = new three_1.MeshBasicMaterial({ color: '#6c6d73' });
        let cube = new three_1.Mesh(cubeGeom, cubeMaterial);
        cube.position.y += 0.07;
        // this.scene.add( cube );
        // Resize
        window.addEventListener('resize', this.resize());
        this.clock = new three_1.Clock();
        //
        this.createBlood();
        this.debug();
        this.tick();
    }
    ;
    createBlood() {
        if (this.bloodGfx) {
            this.bloodGfx.bloodSplatter.material.dispose();
            this.bloodGfx.bloodSplatter.geometry.dispose();
            this.bloodGfx.groundBloodSplatter.material.dispose();
            this.bloodGfx.groundBloodSplatter.geometry.dispose();
            this.scene.remove(this.bloodGfx.wrapper);
        }
        this.bloodGfx = new Blood_1.BloodGfx(this.fadingCoef, this.timeCoef);
        this.scene.add(this.bloodGfx.wrapper);
    }
    ;
    debug() {
        const props = {
            bloodGroundColor: '#ff0000',
            bloodColor: '#ff0000'
        };
        let pane = new tweakpane_1.Pane({ title: "Explosion" }); //  expanded: false
        pane.element.parentElement.style['width'] = '330px';
        let color = pane.addFolder({ title: "Blood color" });
        let bloodSpeed = pane.addFolder({ title: "Speed" });
        let bloodSize = pane.addFolder({ title: "Size" });
        color.addInput(props, 'bloodGroundColor', { label: 'Ground blood color' }).on('change', () => {
            this.bloodGfx.groundBloodSplatter.material.uniforms.uColorLight.value.setHex(parseInt(props.bloodGroundColor.replace('#', '0x')));
        });
        color.addInput(props, 'bloodColor', { label: 'Blood color' }).on('change', () => {
            this.bloodGfx.bloodSplatter.material.uniforms.uColorLight.value.setHex(parseInt(props.bloodColor.replace('#', '0x')));
        });
        //
        bloodSpeed.addInput(this, 'timeCoef', { min: 0.01, max: 2, label: 'Falling blood speed' });
        bloodSpeed.addInput(this, 'fadingCoef', { min: 0.01, max: 2, label: 'Ground fading speed' });
        bloodSize.addInput(this.bloodGfx.bloodSplatter, 'paneSize', { min: 0.0, max: 2, label: 'Size falling blood' }).on('change', (options) => {
            for (let i = 0; i < this.bloodGfx.bloodSplatter.numberOfBloodDrops; i++) {
                let size = this.bloodGfx.bloodSplatter.geometry.attributes.size.getX(i) * options.value;
                this.bloodGfx.bloodSplatter.geometry.attributes.size.setX(i, size);
                this.bloodGfx.bloodSplatter.geometry.attributes.size.needsUpdate = true;
            }
        });
    }
    ;
    resize() {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    ;
}
exports["default"] = new Main();


/***/ }),

/***/ "./src/scripts/shaders/BloodSplatter.Shader.ts":
/*!*****************************************************!*\
  !*** ./src/scripts/shaders/BloodSplatter.Shader.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BloodSplatterMaterial = void 0;
const three_6 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
//
let loader = new three_6.TextureLoader();
let noise = loader.load('resources/textures/noise.png');
class BloodSplatterMaterial extends three_6.ShaderMaterial {
    constructor() {
        super();
        this.transparent = true,
            this.vertexShader = `
        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;
        varying float vBloodOpacity;

        uniform float uTime;
        uniform float uBloodTime;

        attribute vec4 transformRow1;
        attribute vec4 transformRow2;
        attribute vec4 transformRow3;
        attribute vec4 transformRow4;
        attribute float size;
        attribute float colorCoef;
        attribute float shape;
        attribute float bloodOpacity;

        void main () {

            mat4 transforms = mat4(
                transformRow1,
                transformRow2,
                transformRow3,
                transformRow4
            );

            gl_Position = projectionMatrix * ( modelViewMatrix * transforms * vec4( 0.0, 0.0, position.z, 1.0 ) + vec4( position * size * 0.7, 1.0 ) ); //2.3

            // gl_Position = projectionMatrix * ( modelViewMatrix * transforms * vec4( 0.0, 0.0, 0.0, 1.0 ) + vec4( pos, 1.0 ) );

            vUv = uv;
            vColorCoef = colorCoef;
            vShape = shape;
            vBloodOpacity = bloodOpacity;

        }`,
            this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform float uFading;
        uniform vec3 uColorLight;
        uniform vec3 uColorDark;

        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;
        varying float vBloodOpacity;

        void main () {

            // vec2 centeredUv = vec2( vec2( vUv.x * ( uTime * 0.0005 ) * 1.9 - 0.1, ( vUv.y * ( uTime * 0.0009 ) * 0.9 - 0.2 ) ) );
            vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 1.7 ) );
            float distanceToCenter = length( centeredUv ) * 11.0;

            float noise = texture2D( uNoise, vUv ).r * 0.6;

            // if ( distanceToCenter * uTime * 0.0002 > noise * vShape + uTime * 0.0001 * noise ) { discard; };
            if ( distanceToCenter * uTime * 0.0002 + 0.1 > noise + uTime * 0.0001 * noise ) { discard; };

            //

            vec3 mixColor = mix( uColorLight, uColorDark, vec3( noise ) * vColorCoef * 1.0 );

            gl_FragColor.rgb = mixColor;
            gl_FragColor.a = ( 1.0 - uFading ) * vBloodOpacity; // * 0.001;
            if ( gl_FragColor.a < 0.0001 ) { discard; }

        }`,
            this.transparent = true,
            this.uniforms = {
                uNoise: { value: noise },
                uTime: { value: 0.0 },
                uColorLight: { value: new three_6.Color(0xe32205) },
                uColorDark: { value: new three_6.Color(0xe330802) },
                uBloodTime: { value: 0.1 },
                uFading: { value: 0.0 }
            };
    }
}
exports.BloodSplatterMaterial = BloodSplatterMaterial;
;


/***/ }),

/***/ "./src/scripts/shaders/GroundBloodSplatter.Shader.ts":
/*!***********************************************************!*\
  !*** ./src/scripts/shaders/GroundBloodSplatter.Shader.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroundBloodSplatterMaterial = void 0;
const three_5 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
//
let loader = new three_5.TextureLoader();
let noise = loader.load('resources/textures/noise.png');
class GroundBloodSplatterMaterial extends three_5.ShaderMaterial {
    constructor() {
        super();
        this.transparent = true,
            this.vertexShader = `
        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;

        uniform float uTime;
        uniform float uBloodTime;

        attribute vec4 transformRow1;
        attribute vec4 transformRow2;
        attribute vec4 transformRow3;
        attribute vec4 transformRow4;
        attribute float size;
        attribute float colorCoef;
        attribute float shape;

        void main () {

            mat4 transforms = mat4(
                transformRow1,
                transformRow2,
                transformRow3,
                transformRow4
            );

            vec3 pos = position;

            gl_Position = projectionMatrix * modelViewMatrix * transforms * vec4( pos * size * 1.0, 1.0 );

            vUv = uv;
            vColorCoef = colorCoef;
            vShape = shape;

        }`,
            this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform float uFading;
        uniform float uVisibility;
        uniform vec3 uColorLight;
        uniform vec3 uColorDark;

        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;

        void main () {

            vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 1.0 ) );
            // vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 2.2 ) );
            float distanceToCenter = length( centeredUv ) * 2.0;

            float noise = texture2D( uNoise, vUv ).r * 0.6;

            if ( distanceToCenter > noise * 1.0 ) { discard; };
            // if ( distanceToCenter * uTime * 0.000002 > noise * vShape + uTime * 0.000001 * noise ) { discard; };

            //

            vec3 mixColor = mix( uColorLight, uColorDark, vec3( noise ) * vColorCoef * 1.0 );

            gl_FragColor.rgb = mixColor;
            gl_FragColor.a = ( 1.0 - uFading * noise * 2.3 ) * uVisibility; // * 0.001;

        }`,
            this.transparent = true,
            this.uniforms = {
                uNoise: { value: noise },
                uTime: { value: 0.0 },
                uColorLight: { value: new three_5.Color(0xe32205) },
                uColorDark: { value: new three_5.Color(0xe330802) },
                uBloodTime: { value: 0.1 },
                uFading: { value: 0.0 },
                uVisibility: { value: 0.0 }
            };
    }
}
exports.GroundBloodSplatterMaterial = GroundBloodSplatterMaterial;
;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkblood"] = self["webpackChunkblood"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/scripts/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map