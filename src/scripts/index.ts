import { AmbientLight, BoxBufferGeometry, Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneBufferGeometry, PointLight, Scene, WebGLRenderer } from "three";
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BloodGfx } from './Blood';
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

class Main {

    public camera: PerspectiveCamera;
    public plane: Mesh;
    public scene: Scene;
    public canvas: HTMLCanvasElement;
    public controls: OrbitControls;
    public renderer: WebGLRenderer;
    public delta: number;
    public elapsedTime: number = 0;
    public clock: Clock;
    public material: BloodSplatterMaterial;
    public bloodSplatter: Mesh;

    public bloodGfx: BloodGfx;

    private sizes = {
        width: 0,
        height: 0
    };

    constructor() {

        this.init();
        console.log('loaded!');

    };

    public init () : void {

        // Canvas
        this.canvas = document.querySelector( 'canvas.webglView' ) as HTMLCanvasElement;

        // Scene
        this.scene = new Scene();
        this.scene.background = new Color( '#b3afbd' ); //324345 - at night  // b2eef5

        // Sizes
        this.sizes.width = window.innerWidth,
        this.sizes.height = window.innerHeight;

        // Camera
        this.camera = new PerspectiveCamera( 45, this.sizes.width / this.sizes.height, 0.1, 100 );
        this.camera.position.set( 1, 1, 1 );
        this.scene.add( this.camera );

        const ambientLight = new AmbientLight( 0xffffff, 0.4 );
        this.scene.add( ambientLight );

        // Controls
        this.controls = new MapControls( this.camera, this.canvas );
        this.controls.enableZoom = false;

        // Renderer
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize( this.sizes.width, this.sizes.height );
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

        // Plane
        let planeGeometry = new PlaneBufferGeometry( 1.5, 1.5, 1, 1 );
        let planeMaterial = new MeshBasicMaterial( { color: '#818891' } );
        this.plane = new Mesh( planeGeometry, planeMaterial );
        this.plane.rotation.x -= Math.PI / 2;
        this.plane.rotation.z -= Math.PI / 4;
        this.scene.add( this.plane );

        //
        const light = new PointLight( 0xe9f7ec, 1, 500 );
        light.position.set( 2, 2, 2 );
        this.scene.add( light );

        // Cube
        let cubeGeom = new BoxBufferGeometry( 0.15, 0.15, 0.15 );
        let cubeMaterial = new MeshBasicMaterial( { color: '#6c6d73' } );
        let cube = new Mesh( cubeGeom, cubeMaterial );
        cube.position.y += 0.07;
        this.scene.add( cube );

        // Resize
        window.addEventListener( 'resize', this.resize() );

        this.clock = new Clock();

        //

        // this.addBlood();

        let geometry = new PlaneBufferGeometry( 0.51, 0.51 );
        this.material = new BloodSplatterMaterial();
        this.bloodSplatter = new Mesh( geometry, this.material );

        this.scene.add( this.bloodSplatter );

        this.tick();

    };

    public addBlood () : void {

        // this.bloodGfx = new BloodGfx();

        let geometry = new PlaneBufferGeometry( 0.51, 0.51 );
        let material = new BloodSplatterMaterial();
        let bloodSplatter = new Mesh( geometry, material );

        this.scene.add( bloodSplatter );

    };

    private resize () : any {

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.sizes.width, this.sizes.height );
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

    };

    public tick = () : void => {

        window.requestAnimationFrame( this.tick );

        this.delta = this.clock.getDelta() * 1000;
        this.elapsedTime += this.delta;

        if ( this.sizes.width !== window.innerWidth || this.sizes.height !== window.innerHeight ) {

            this.resize();

        }

        if ( this.bloodSplatter ) this.material.uniforms.uTime.value = this.elapsedTime;

        this.controls.update();
        this.renderer.render( this.scene, this.camera );

    };

}

export default new Main();