import { PlaneGeometry } from "three";
import { BloodSplatterMaterial } from './shaders/BloodSplatter.Shader';

//

export class addGroundBloodSplatter {

    public material: BloodSplatterMaterial;
    public geometry: PlaneGeometry;

    constructor () {

        this.generate();

    };

    public generate () : void {

        this.geometry = new PlaneGeometry( 1, 1 );
        this.material = new BloodSplatterMaterial();

    };

    public update () {



    };

};