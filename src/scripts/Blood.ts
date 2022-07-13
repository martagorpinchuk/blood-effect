import { Object3D } from "three";
import { BloodSplatter } from "./BloodSplatter";

//

export class BloodGfx {

    public bloodSplatter = new BloodSplatter();

    public wrapper: Object3D = new Object3D();

    constructor () {

        this.addBloodSplatter();

        this.wrapper.add( this.bloodSplatter.wrapper );

    };

    public addBloodSplatter () : void {

        this.bloodSplatter = new BloodSplatter();

    };

    public addGroundBloodSplatter () : void {

        

    };

    public update ( elapsedTime ) : void {

        this.bloodSplatter.update( elapsedTime );

    };

};
