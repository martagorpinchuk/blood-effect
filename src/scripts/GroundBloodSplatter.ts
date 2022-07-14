import { Euler, Float32BufferAttribute, Matrix4, Mesh, Object3D, PlaneGeometry, Quaternion, Vector3 } from "three";
import { GroundBloodSplatterMaterial } from './shaders/GroundBloodSplatter.Shader';
import Main from './index';

//

export class GroundBloodSplatter {

    public material: GroundBloodSplatterMaterial;
    public geometry: PlaneGeometry;
    public wrapper: Object3D = new Object3D();
    public groundBloodSplatter: Mesh;

    // public main: Main;

    constructor () {

        this.generate();

    };

    public generate () : void {

        this.geometry = new PlaneGeometry( 1, 1.5 );
        this.material = new GroundBloodSplatterMaterial();

        this.groundBloodSplatter = new Mesh( this.geometry, this.material );

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < 4; i ++ ) {

            let rotationX = - Math.PI / 2;
            let rotationY = 0;//Math.PI / 2;
            let rotationZ = 0;//Math.PI / 2;

            let transformMatrix = new Matrix4().compose( new Vector3( 0, 0.01, - 0.6 ), new Quaternion().setFromEuler( new Euler( rotationX, rotationY, rotationZ ) ), new Vector3( 0.4, 0.4, 0.4 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

        }

        this.geometry.setAttribute( 'transformRow1', new Float32BufferAttribute( new Float32Array( transformRow1 ), 4 ) );
        this.geometry.setAttribute( 'transformRow2', new Float32BufferAttribute( new Float32Array( transformRow2 ), 4 ) );
        this.geometry.setAttribute( 'transformRow3', new Float32BufferAttribute( new Float32Array( transformRow3 ), 4 ) );
        this.geometry.setAttribute( 'transformRow4', new Float32BufferAttribute( new Float32Array( transformRow4 ), 4 ) );

        this.wrapper.add( this.groundBloodSplatter );

    };

    public update ( elapsedTime ) {

        // this.material.uniforms.uBloodTime.value = elapsedTime;

    };

};