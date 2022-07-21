import { Euler, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Matrix4, Mesh, Object3D, PlaneGeometry, Quaternion, Vector3 } from "three";
import { GroundBloodSplatterMaterial } from './shaders/GroundBloodSplatter.Shader';
import Main from './index';

//

export class GroundBloodSplatter {

    public material: GroundBloodSplatterMaterial;
    public geometry: InstancedBufferGeometry;
    public wrapper: Object3D = new Object3D();
    public mesh: Mesh;
    public numberOfBloodDrops: number = 9;
    public positions: Array<number> = [];
    public size: Array<number> = [];
    public colorCoef: Array<number> = [];
    public shape: Array<number> = [];
    public noiseFade: Array<number> = [];

    constructor ( splashPositionX: Array<number>, splashPositionZ: Array<number> ) {

        this.generate( splashPositionX, splashPositionZ );

    };

    public generate ( splashPositionX, splashPositionZ ) : void {

        if ( this.mesh ) {

            this.geometry.dispose();

            this.wrapper.remove( this.mesh );

        }

        this.geometry = new InstancedBufferGeometry();
        this.material = new GroundBloodSplatterMaterial();
        this.mesh = new Mesh( this.geometry, this.material );

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            let rotationX = - Math.PI / 2;
            let rotationY = 0;
            let rotationZ = 0;

            let positionX = 1;
            let positionY = 0.01;
            let positionZ = 1;

            let transformMatrix = new Matrix4().compose( new Vector3( positionX, positionY, positionZ ), new Quaternion().setFromEuler( new Euler( rotationX, rotationY, rotationZ ) ), new Vector3( 0.4, 0.4, 0.4 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

            this.size.push( Math.random() * 2 );
            this.colorCoef.push( ( Math.random() + 0.5 ) * 1.4 );
            this.shape.push( Math.random() );

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
        this.geometry.setAttribute( 'size', new InstancedBufferAttribute( new Float32Array( this.size ), 1 ) );
        this.geometry.setAttribute( 'colorCoef', new InstancedBufferAttribute( new Float32Array( this.colorCoef ), 1 ) );
        this.geometry.setAttribute( 'shape', new InstancedBufferAttribute( new Float32Array( this.shape ), 1 ) );

        this.wrapper.add( this.mesh );

    };

    public update ( elapsedTime, splashPositionX, splashPositionZ ) {

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            let newPositionX = this.geometry.attributes.transformRow4.getX( i );
            let newPositionZ = this.geometry.attributes.transformRow4.getZ( i );

            newPositionX = splashPositionX[ i ];
            newPositionZ = splashPositionZ[ i ];

            this.geometry.attributes.transformRow4.setX( i, newPositionX );
            this.geometry.attributes.transformRow4.setZ( i, newPositionZ );

            this.geometry.attributes.transformRow1.needsUpdate = true;
            this.geometry.attributes.transformRow2.needsUpdate = true;
            this.geometry.attributes.transformRow3.needsUpdate = true;
            this.geometry.attributes.transformRow4.needsUpdate = true;

        }

    };

};