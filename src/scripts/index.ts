import { AmbientLight, BoxBufferGeometry, Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneBufferGeometry, PointLight, Scene, WebGLRenderer } from "three";
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BloodGfx } from './Blood';
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';
import { Pane } from "tweakpane";

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
    public fadingCoef: number = 1;
    public timeCoef: number = 1;

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
        this.scene.background = new Color( '#b3afbd' );

        // Sizes
        this.sizes.width = window.innerWidth,
        this.sizes.height = window.innerHeight;

        // Camera
        this.camera = new PerspectiveCamera( 45, this.sizes.width / this.sizes.height, 0.1, 100 );
        this.camera.position.set( 3.3, 2.1, 0 );
        this.scene.add( this.camera );

        const ambientLight = new AmbientLight( 0xffffff, 0.4 );
        this.scene.add( ambientLight );

        // Controls
        this.controls = new MapControls( this.camera, this.canvas );

        // Renderer
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize( this.sizes.width, this.sizes.height );
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

        // Plane
        let planeGeometry = new PlaneBufferGeometry( 6.5, 6.5, 1, 1 );
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
        let cubeGeom = new BoxBufferGeometry( 0.25, 0.95, 0.25 );
        let cubeMaterial = new MeshBasicMaterial( { color: '#6c6d73' } );
        let cube = new Mesh( cubeGeom, cubeMaterial );
        cube.position.y += 0.07;
        // this.scene.add( cube );

        // Resize
        window.addEventListener( 'resize', this.resize() );

        this.clock = new Clock();

        //

        this.createBlood();
        this.debug();

        this.tick();

    };

    public createBlood () : void {

        if ( this.bloodGfx ) {

            this.bloodGfx.bloodSplatter.material.dispose();
            this.bloodGfx.bloodSplatter.geometry.dispose();
            this.bloodGfx.groundBloodSplatter.material.dispose();
            this.bloodGfx.groundBloodSplatter.geometry.dispose();

            this.scene.remove( this.bloodGfx.wrapper );

        }

        this.bloodGfx = new BloodGfx( this.fadingCoef, this.timeCoef );
        this.scene.add( this.bloodGfx.wrapper );

    };

    public debug () : void {

        const props = {

            bloodGroundColor: '#ff0000',
            bloodColor: '#ff0000'

        };

        let pane: any = new Pane(  { title: "Explosion" } ); //  expanded: false
        pane.element.parentElement.style['width'] = '330px';

        let color = pane.addFolder( { title: "Blood color" } );
        let bloodSpeed = pane.addFolder( { title: "Speed" } );
        let bloodSize = pane.addFolder( { title: "Size" } );

        color.addInput( props, 'bloodGroundColor', { label: 'Ground blood color' } ).on( 'change', () => {

            this.bloodGfx.groundBloodSplatter.material.uniforms.uColorLight.value.setHex( parseInt( props.bloodGroundColor.replace( '#', '0x' ) ) );

        } );

        color.addInput( props, 'bloodColor', { label: 'Blood color' } ).on( 'change', () => {

            this.bloodGfx.bloodSplatter.material.uniforms.uColorLight.value.setHex( parseInt( props.bloodColor.replace( '#', '0x' ) ) );

        } );

        //

        bloodSpeed.addInput( this, 'timeCoef', { min: 0.01, max: 2, label: 'Falling blood speed' } );
        bloodSpeed.addInput( this, 'fadingCoef', { min: 0.01, max: 2, label: 'Ground fading speed' } );
        bloodSize.addInput( this.bloodGfx.bloodSplatter, 'paneSize', { min: 0.01, max: 2, label: 'Size falling blood' } ).on( 'change', ( options ) => {

            for( let i = 0; i < this.bloodGfx.bloodSplatter.numberOfBloodDrops; i ++ ) {

                let size = this.bloodGfx.bloodSplatter.geometry.attributes.size.getX( i ) * options.value;

                this.bloodGfx.bloodSplatter.geometry.attributes.size.setX( i, size );
                this.bloodGfx.bloodSplatter.geometry.attributes.size.needsUpdate = true;

            }

        } );

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

        if ( this.bloodGfx ) this.bloodGfx.update( this.elapsedTime, this.fadingCoef, this.timeCoef );

        this.controls.update();
        this.renderer.render( this.scene, this.camera );

        if ( Math.round( this.elapsedTime ) > 4500 ) {

            this.createBlood();

            this.elapsedTime = 0;
            this.bloodGfx.elapsedTimeBlood = 0;
            this.bloodGfx.bloodSplatter.elapsedTimeFall = 0;

        }

    };

}

export default new Main();