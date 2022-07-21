import { Clock, Euler, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Matrix4, Mesh, Object3D, PlaneBufferGeometry, PlaneGeometry, Quaternion, Vector3 } from "three";
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

export class BloodSplatter {

    public material: BloodSplatterMaterial;
    public geometry: InstancedBufferGeometry;
    public mesh: Mesh;
    public wrapper: Object3D = new Object3D();
    public clock: Clock;
    public timeOfFall: number;
    public elapsedTimeFall: number = 0;
    public rotationX: number;
    public rotationY: number;
    public rotationZ: number;
    public bloodDisappear: Boolean = false;
    public numberOfBloodDrops: number = 5;
    public positions: Array<number> = [];
    public velocity: Array<number> = [];
    public size: Array<number> = [];
    public colorCoef: Array<number> = [];
    public shape: Array<number> = [];
    public bloodOpacity: Array<number> = [];
    public splashPositionX: Array<number> = [];
    public splashPositionZ: Array<number> = [];

    constructor () {

        this.generate();

        this.clock = new Clock();

    };

    public generate () : void {

        if ( this.mesh ) {

            this.geometry.dispose();

            this.wrapper.remove( this.mesh );

        }

        this.geometry = new InstancedBufferGeometry();
        this.material = new BloodSplatterMaterial();
        this.mesh = new Mesh( this.geometry, this.material );

        if ( this.mesh ) {

            this.geometry.dispose();

            this.wrapper.remove( this.mesh );

        }

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            this.rotationX = 0;//Math.PI / 3;
            this.rotationY = Math.PI / 3; //Math.PI / 9;
            this.rotationZ = 0; //Math.PI / 2;

            let positionX = 0;//( Math.random() - 0.5 ) * 3;
            let positionY = 1;
            let positionZ = 0;//( Math.random() - 0.5 ) * 3;

            let transformMatrix = new Matrix4().compose( new Vector3( positionX, positionY, positionZ ), new Quaternion().setFromEuler( new Euler( this.rotationX, this.rotationY, this.rotationZ ) ), new Vector3( 0.5, 0.5, 0.5 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

            this.velocity.push( Math.random() * 9, ( Math.random() + 0.5 ) * 8, Math.random() * 9 );
            this.size.push( Math.random() * 1 );
            this.colorCoef.push( ( Math.random() + 0.5 ) * 1.4 );
            this.shape.push(  Math.random() );
            this.bloodOpacity.push( 1 );

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

        this.geometry.setAttribute( 'transformRow1',new InstancedBufferAttribute( new Float32Array( transformRow1 ), 4 ) );
        this.geometry.setAttribute( 'transformRow2', new InstancedBufferAttribute( new Float32Array( transformRow2 ), 4 ) );
        this.geometry.setAttribute( 'transformRow3', new InstancedBufferAttribute( new Float32Array( transformRow3 ), 4 ) );
        this.geometry.setAttribute( 'transformRow4', new InstancedBufferAttribute( new Float32Array( transformRow4 ), 4 ) );
        this.geometry.setAttribute( 'velocity', new InstancedBufferAttribute( new Float32Array( this.velocity ), 3 ) );
        this.geometry.setAttribute( 'size', new InstancedBufferAttribute( new Float32Array( this.size ), 1 ) );
        this.geometry.setAttribute( 'colorCoef', new InstancedBufferAttribute( new Float32Array( this.colorCoef ), 1 ) );
        this.geometry.setAttribute( 'shape', new InstancedBufferAttribute( new Float32Array( this.shape ), 1 ) );
        this.geometry.setAttribute( 'bloodOpacity', new InstancedBufferAttribute( new Float32Array( this.bloodOpacity ), 1 ) );

        this.wrapper.add( this.mesh );

    };

    public update ( elapsedTime, timeCoef ) : void {

        this.material.uniforms.uTime.value = elapsedTime;

        this.timeOfFall = this.clock.getDelta() * 1000;
        this.elapsedTimeFall += this.timeOfFall;

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            let newPositionX = this.geometry.attributes.transformRow4.getX( i );
            let newPositionY = this.geometry.attributes.transformRow4.getY( i );
            let newPositionZ = this.geometry.attributes.transformRow4.getZ( i );

            let velocityX = this.geometry.attributes.velocity.getX( i ) * 0.1;
            let velocityY = this.geometry.attributes.velocity.getY( i ) * 0.1;
            let velocityZ = this.geometry.attributes.velocity.getZ( i ) * 0.1;

            if ( + newPositionY.toFixed( 1 ) === 0 ) {

                let bloodOpacity = this.geometry.attributes.bloodOpacity.getX( i );

                bloodOpacity = 0;

                this.geometry.attributes.bloodOpacity.setX( i , bloodOpacity );

                this.geometry.attributes.bloodOpacity.needsUpdate = true;

                this.bloodDisappear = true;

                if (  this.bloodDisappear ) {

                    this.splashPositionX.push( newPositionX );
                    this.splashPositionZ.push( newPositionZ );

                }
            }

            newPositionX += - velocityX * this.elapsedTimeFall * 0.0001 * timeCoef;
            newPositionY += - velocityY * this.elapsedTimeFall * 0.0001 * timeCoef;
            newPositionZ += - velocityZ * this.elapsedTimeFall * 0.0001 * timeCoef;

            this.geometry.attributes.transformRow4.setX( i, newPositionX );
            this.geometry.attributes.transformRow4.setY( i, newPositionY );
            this.geometry.attributes.transformRow4.setZ( i, newPositionZ );

            this.geometry.attributes.transformRow1.needsUpdate = true;
            this.geometry.attributes.transformRow2.needsUpdate = true;
            this.geometry.attributes.transformRow3.needsUpdate = true;
            this.geometry.attributes.transformRow4.needsUpdate = true;

        }

    };

};
