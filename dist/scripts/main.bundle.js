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
//
class BloodGfx {
    constructor() {
        this.bloodSplatter = new BloodSplatter_1.BloodSplatter();
        this.wrapper = new three_2.Object3D();
        this.addBloodSplatter();
        this.wrapper.add(this.bloodSplatter.wrapper);
    }
    ;
    addBloodSplatter() {
        this.bloodSplatter = new BloodSplatter_1.BloodSplatter();
    }
    ;
    addGroundBloodSplatter() {
    }
    ;
    update(elapsedTime) {
        this.bloodSplatter.update(elapsedTime);
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
const three_3 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
const BloodSplatter_Shader_1 = __webpack_require__(/*! ./shaders/BloodSplatter.Shader */ "./src/scripts/shaders/BloodSplatter.Shader.ts");
//
class BloodSplatter {
    constructor() {
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.wrapper = new three_3.Object3D();
        this.elapsedTimeFall = 0;
        this.generate();
        this.clock = new three_3.Clock();
    }
    ;
    generate() {
        this.geometry = new three_3.PlaneGeometry(1, 1);
        this.material = new BloodSplatter_Shader_1.BloodSplatterMaterial();
        // this.bloodSplatter = new Mesh( this.geometry, this.material );
        if (this.bloodSplatter) {
            this.geometry.dispose();
            this.wrapper.remove(this.bloodSplatter);
        }
        const transformRow1 = [];
        const transformRow2 = [];
        const transformRow3 = [];
        const transformRow4 = [];
        for (let i = 0; i < 4; i++) {
            this.rotationX = -Math.PI / 2;
            this.rotationY = Math.PI / 4; //Math.PI / 9;
            this.rotationZ = Math.PI / 2;
            let transformMatrix = new three_3.Matrix4().compose(new three_3.Vector3(this.positionX, this.positionY, this.positionZ), new three_3.Quaternion().setFromEuler(new three_3.Euler(this.rotationX, this.rotationY, this.rotationZ)), new three_3.Vector3(0.7, 0.7, 0.7)).toArray();
            transformRow1.push(transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3]);
            transformRow2.push(transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7]);
            transformRow3.push(transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11]);
            transformRow4.push(transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15]);
        }
        this.geometry.setAttribute('transformRow1', new three_3.Float32BufferAttribute(new Float32Array(transformRow1), 4));
        this.geometry.setAttribute('transformRow2', new three_3.Float32BufferAttribute(new Float32Array(transformRow2), 4));
        this.geometry.setAttribute('transformRow3', new three_3.Float32BufferAttribute(new Float32Array(transformRow3), 4));
        this.geometry.setAttribute('transformRow4', new three_3.Float32BufferAttribute(new Float32Array(transformRow4), 4));
        this.bloodSplatter = new three_3.Mesh(this.geometry, this.material);
        this.wrapper.add(this.bloodSplatter);
    }
    ;
    update(elapsedTime) {
        this.material.uniforms.uTime.value = elapsedTime;
        this.timeOfFall = this.clock.getDelta() * 1000;
        this.elapsedTimeFall += this.timeOfFall;
        this.material.uniforms.uBloodTime.value = Math.abs(Math.sin(this.elapsedTimeFall * 0.001) * 1.5);
        if (this.material.uniforms.uBloodTime.value.toFixed(1) == 1.5) {
            this.clock.stop();
            // this.material.uniforms.uFading.value = 1.0;
        }
    }
    ;
}
exports.BloodSplatter = BloodSplatter;
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
//
class Main {
    constructor() {
        this.elapsedTime = 0;
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
                this.bloodGfx.update(this.elapsedTime);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
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
        this.scene.background = new three_1.Color('#b3afbd'); //324345 - at night  // b2eef5
        // Sizes
        this.sizes.width = window.innerWidth,
            this.sizes.height = window.innerHeight;
        // Camera
        this.camera = new three_1.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(2.3, 1, 0);
        this.scene.add(this.camera);
        const ambientLight = new three_1.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        // Controls
        this.controls = new OrbitControls_js_1.MapControls(this.camera, this.canvas);
        // this.controls.enableZoom = false;
        // Renderer
        this.renderer = new three_1.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Plane
        let planeGeometry = new three_1.PlaneBufferGeometry(1.5, 1.5, 1, 1);
        let planeMaterial = new three_1.MeshBasicMaterial({ color: '#818891' });
        this.plane = new three_1.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x -= Math.PI / 2;
        this.plane.rotation.z -= Math.PI / 4;
        this.scene.add(this.plane);
        //
        const light = new three_1.PointLight(0xe9f7ec, 1, 500);
        light.position.set(2, 2, 2);
        this.scene.add(light);
        // Cube
        let cubeGeom = new three_1.BoxBufferGeometry(0.15, 0.15, 0.15);
        let cubeMaterial = new three_1.MeshBasicMaterial({ color: '#6c6d73' });
        let cube = new three_1.Mesh(cubeGeom, cubeMaterial);
        cube.position.y += 0.07;
        this.scene.add(cube);
        // Resize
        window.addEventListener('resize', this.resize());
        this.clock = new three_1.Clock();
        //
        this.addBlood();
        this.tick();
    }
    ;
    addBlood() {
        this.bloodGfx = new Blood_1.BloodGfx();
        this.scene.add(this.bloodGfx.wrapper);
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
const three_4 = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
//
let loader = new three_4.TextureLoader();
let noise = loader.load('resources/textures/noise.png');
class BloodSplatterMaterial extends three_4.ShaderMaterial {
    constructor() {
        super();
        this.transparent = true,
            this.vertexShader = `
        varying vec2 vUv;

        uniform float uTime;
        uniform float uBloodTime;

        attribute vec4 transformRow1;
        attribute vec4 transformRow2;
        attribute vec4 transformRow3;
        attribute vec4 transformRow4;

        void main () {

            mat4 transforms = mat4(
                transformRow1,
                transformRow2,
                transformRow3,
                transformRow4
            );

            vec3 pos = position;
            pos.y += cos( uBloodTime ) * 0.6;
            pos.x += sin( uBloodTime ) * 0.6;

            // gl_Position = projectionMatrix * modelViewMatrix * transforms * vec4( pos, 1.0 );

            gl_Position = projectionMatrix * ( modelViewMatrix * transforms * vec4( 0.0, 0.0, 0.0, 1.0 ) + vec4( pos, 1.0 ) );

            vUv = uv;

        }`,
            this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform float uFading;
        uniform vec3 uColorLight;
        uniform vec3 uColorDark;

        varying vec2 vUv;

        void main () {

            vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 2.2 ) );
            float distanceToCenter = length( centeredUv );

            float noise = texture2D( uNoise, vUv ).r * 0.6;

            if ( distanceToCenter > noise * 0.67 ) { discard; };

            //

            vec3 mixColor = mix( uColorLight, uColorDark, vec3( noise ) * 1.9 );
            // mixColor = step( vec3(0.3), vec3(1.5) );

            gl_FragColor.rgb = mixColor;
            gl_FragColor.a = 1.0 - uFading; // * 0.001;

        }`,
            this.uniforms = {
                uNoise: { value: noise },
                uTime: { value: 0.0 },
                uColorLight: { value: new three_4.Color(0xe32205) },
                uColorDark: { value: new three_4.Color(0xe330802) },
                uBloodTime: { value: 0.1 },
                uFading: { value: 0.0 }
            };
    }
}
exports.BloodSplatterMaterial = BloodSplatterMaterial;
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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