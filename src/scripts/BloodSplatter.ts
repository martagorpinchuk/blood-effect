import { Clock, Euler, Float32BufferAttribute, Matrix4, Mesh, Object3D, PlaneBufferGeometry, PlaneGeometry, Quaternion, Vector3 } from "three";
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

export class BloodSplatter {

    public material: BloodSplatterMaterial;
    public geometry: PlaneBufferGeometry;
    public bloodSplatter: Mesh;
    public positionX: number = 0;
    public positionY: number = 0;
    public positionZ: number = 0;
    public wrapper: Object3D = new Object3D();
    public clock: Clock;
    public timeOfFall: number;
    public elapsedTimeFall: number = 0;
    public rotationX: number;
    public rotationY: number;
    public rotationZ: number;

    constructor () {

        this.generate();

        this.clock = new Clock();

    };

    public generate () : void {

        this.geometry = new PlaneGeometry( 1, 1 );
        this.material = new BloodSplatterMaterial();
        // this.bloodSplatter = new Mesh( this.geometry, this.material );

        if ( this.bloodSplatter ) {

            this.geometry.dispose();

            this.wrapper.remove( this.bloodSplatter );

        }

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < 4; i ++ ) {

            this.rotationX = - Math.PI / 2;
            this.rotationY = Math.PI / 4; //Math.PI / 9;
            this.rotationZ = Math.PI / 2;

            let transformMatrix = new Matrix4().compose( new Vector3( this.positionX, this.positionY, this.positionZ ), new Quaternion().setFromEuler( new Euler( this.rotationX, this.rotationY, this.rotationZ ) ), new Vector3( 0.7, 0.7, 0.7 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

        }

        this.geometry.setAttribute( 'transformRow1', new Float32BufferAttribute( new Float32Array( transformRow1 ), 4 ) );
        this.geometry.setAttribute( 'transformRow2', new Float32BufferAttribute( new Float32Array( transformRow2 ), 4 ) );
        this.geometry.setAttribute( 'transformRow3', new Float32BufferAttribute( new Float32Array( transformRow3 ), 4 ) );
        this.geometry.setAttribute( 'transformRow4', new Float32BufferAttribute( new Float32Array( transformRow4 ), 4 ) );

        this.bloodSplatter = new Mesh( this.geometry, this.material );
        this.wrapper.add( this.bloodSplatter );

    };

    public update ( elapsedTime ) : void {

        this.material.uniforms.uTime.value = elapsedTime;

        this.timeOfFall = this.clock.getDelta() * 1000;
        this.elapsedTimeFall += this.timeOfFall;

        this.material.uniforms.uBloodTime.value = Math.abs( Math.sin( this.elapsedTimeFall * 0.001 ) * 1.5 );

        if ( this.material.uniforms.uBloodTime.value.toFixed( 1 ) == 1.5 ) {

            this.clock.stop();

            // this.material.uniforms.uFading.value = 1.0;

        }

    };

};
