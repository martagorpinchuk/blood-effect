import { Clock, Euler, Float32BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Matrix4, Mesh, Object3D, PlaneBufferGeometry, PlaneGeometry, Quaternion, Vector3 } from "three";
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

export class BloodSplatter {

    public material: BloodSplatterMaterial;
    public geometry: InstancedBufferGeometry;
    public bloodSplatter: Mesh;
    // public positionX: number = 0;
    // public positionY: number = 0;
    // public positionZ: number = - 0.29;
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

    constructor () {

        this.generate();

        this.clock = new Clock();

    };

    public generate () : void {

        this.geometry = new InstancedBufferGeometry();
        this.material = new BloodSplatterMaterial();
        this.bloodSplatter = new Mesh( this.geometry, this.material );

        if ( this.bloodSplatter ) {

            this.geometry.dispose();

            this.wrapper.remove( this.bloodSplatter );

        }

        const transformRow1: number[] = [];
        const transformRow2: number[] = [];
        const transformRow3: number[] = [];
        const transformRow4: number[] = [];

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            this.rotationX = 0; //Math.PI / 2;
            this.rotationY = Math.PI / 2; //Math.PI / 9;
            this.rotationZ = 0; //Math.PI / 2;

            let positionX = 0;//( Math.random() - 0.5 ) * 3;
            let positionY = 0.5;
            let positionZ = 0;//( Math.random() - 0.5 ) * 3;

            let transformMatrix = new Matrix4().compose( new Vector3( positionX, positionY, positionZ ), new Quaternion().setFromEuler( new Euler( this.rotationX, this.rotationY, this.rotationZ ) ), new Vector3( 0.5, 0.5, 0.5 ) ).toArray();

            transformRow1.push( transformMatrix[0], transformMatrix[1], transformMatrix[2], transformMatrix[3] );
            transformRow2.push( transformMatrix[4], transformMatrix[5], transformMatrix[6], transformMatrix[7] );
            transformRow3.push( transformMatrix[8], transformMatrix[9], transformMatrix[10], transformMatrix[11] );
            transformRow4.push( transformMatrix[12], transformMatrix[13], transformMatrix[14], transformMatrix[15] );

            this.velocity.push( ( Math.random() ) * 2, ( Math.random() ) * 2, ( Math.random() ) * 2 );

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

        this.wrapper.add( this.bloodSplatter );

    };

    public update ( elapsedTime ) : void {

        this.material.uniforms.uTime.value = elapsedTime;

        this.timeOfFall = this.clock.getDelta() * 1000;
        this.elapsedTimeFall += this.timeOfFall;

        this.material.uniforms.uBloodTime.value = Math.abs( Math.sin( this.elapsedTimeFall * 0.002 ) * 1.5 );

        if ( this.material.uniforms.uBloodTime.value.toFixed( 1 ) == 1.5 ) {

            this.clock.stop();

            if ( this.bloodSplatter ) {

                this.material.dispose();
                this.geometry.dispose();

                this.wrapper.remove( this.bloodSplatter );

            }

            this.bloodDisappear = true;

        }

        for ( let i = 0; i < this.numberOfBloodDrops; i ++ ) {

            let newPositionX = this.geometry.attributes.transformRow4.getX( i );
            let newPositionY = 0; //this.geometry.attributes.transformRow4.getY( i );
            let newPositionZ = this.geometry.attributes.transformRow4.getZ( i );

            let velocityX = this.geometry.attributes.velocity.getX( i );
            let velocityZ = this.geometry.attributes.velocity.getZ( i );

            newPositionX = - Math.abs( Math.sin( this.elapsedTimeFall * 0.001 ) * 1.5 ) * velocityX;
            newPositionZ = - Math.abs( Math.sin( this.elapsedTimeFall * 0.001 ) * 1.5 ) * velocityZ;

            this.geometry.attributes.transformRow4.setX( i, newPositionX );
            this.geometry.attributes.transformRow4.setZ( i, newPositionZ );

            // newPositionX +=

        }

        this.geometry.attributes.transformRow4.needsUpdate = true;

    };

};
