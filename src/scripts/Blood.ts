import { BloodSplatter } from "./BloodSplatter";

//

export class BloodGfx {

    public bloodSplatter = new BloodSplatter();

    constructor () {

        this.addBloodSplatter();

    };

    public addBloodSplatter () : void {

        this.bloodSplatter = new BloodSplatter();

    };

    public update ( elapsedTime ) : void {

        this.bloodSplatter.update( elapsedTime );

    };

};
