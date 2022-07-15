import { Euler, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Matrix4, Mesh, Object3D, PlaneGeometry, Quaternion, Vector3 } from "three";
import { GroundBloodSplatterMaterial } from './shaders/GroundBloodSplatter.Shader';
import Main from './index';

//

export class GroundBloodSplatter {

    public material: GroundBloodSplatterMaterial;
    public geometry: InstancedBufferGeometry;
    public wrapper: Object3D = new Object3D();
    public groundBloodSplatter: Mesh;
    public numberOfBloodDrops: number = 5;
    public positions: Array<number> = [];

    constructor () {

        this.generate();

    };

    public generate () : void {

        this.geometry = new InstancedBufferGeometry();
        this.material = new GroundBloodSplatterMaterial();

        this.groundBloodSplatter = new Mesh( this.geometry, this.material );

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            let rotationX = - Math.PI / 2;
            let rotationY = 0;//Math.PI / 2;
            let rotationZ = 0;//Math.PI / 2;

            let positionX = ( Math.random() - 1 ) * 2;
            let positionY = 0.01;
            let positionZ = ( Math.random() - 1 ) * 2;

            let transformMatrix = new Matrix4().compose( new Vector3( positionX, positionY, positionZ ), new Quaternion().setFromEuler( new Euler( rotationX, rotationY, rotationZ ) ), new Vector3( 0.4, 0.4, 0.4 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

        }

        this.positions = [

            - 1.0, - 1.0,  0.0,
              1.0, - 1.0,  0.0,
              1.0,   1.0,  0.0,

              1.0,   1.0,  0.0,
            - 1.0,   1.0,  0.0,
            - 1.0, - 1.0,  0.0

        ];

        const uv = [

            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0

        ];

        this.geometry.setAttribute( 'position', new Float32BufferAttribute( this.positions, 3 ) );
        this.geometry.setAttribute( 'uv', new Float32BufferAttribute( uv, 2 ) );

        this.geometry.setAttribute( 'transformRow1', new InstancedBufferAttribute( new Float32Array( transformRow1 ), 4 ) );
        this.geometry.setAttribute( 'transformRow2', new InstancedBufferAttribute( new Float32Array( transformRow2 ), 4 ) );
        this.geometry.setAttribute( 'transformRow3', new InstancedBufferAttribute( new Float32Array( transformRow3 ), 4 ) );
        this.geometry.setAttribute( 'transformRow4', new InstancedBufferAttribute( new Float32Array( transformRow4 ), 4 ) );

        this.wrapper.add( this.groundBloodSplatter );

    };

    public update ( elapsedTime ) {

        // this.material.uniforms.uBloodTime.value = elapsedTime;

    };

};