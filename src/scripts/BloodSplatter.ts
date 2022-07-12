import { Mesh, Object3D, PlaneBufferGeometry } from "three";
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

export class BloodSplatter {

    public material: BloodSplatterMaterial;
    public geometry: PlaneBufferGeometry;
    public wrapper: Object3D = new Object3D();

    constructor () {

        this.generate();

    };

    public generate () : void {

        this.geometry = new PlaneBufferGeometry( 1, 1 );
        this.material = new BloodSplatterMaterial();
        let bloodSplatter = new Mesh( this.geometry, this.material );

        if ( bloodSplatter ) {

            this.geometry.dispose();

            this.wrapper.remove( bloodSplatter );

        }

        this.wrapper.add( bloodSplatter );

    };

    public update ( elapsedTime ) : void {

        this.material.uniforms.uTime.value = elapsedTime;

    };

};
