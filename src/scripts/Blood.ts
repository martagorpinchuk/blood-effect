import { Clock, Object3D } from "three";
import { BloodSplatter } from "./BloodSplatter";
import { GroundBloodSplatter } from './GroundBloodSplatter';
import { Pane } from "tweakpane";

//

export class BloodGfx {

    public bloodSplatter: BloodSplatter;
    public groundBloodSplatter: GroundBloodSplatter;
    public clock: Clock;
    public delta: number;
    public elapsedTimeBlood: number = 0;

    public wrapper: Object3D = new Object3D();

    constructor ( fadingCoef, timeCoef ) {

        this.clock = new Clock();

        this.addBloodSplatter();
        this.addGroundBloodSplatter();

        this.wrapper.add( this.bloodSplatter.wrapper );
        this.wrapper.add( this.groundBloodSplatter.wrapper );

    };

    public addBloodSplatter () : void {

        this.bloodSplatter = new BloodSplatter();

    };

    public addGroundBloodSplatter () : void {

        this.groundBloodSplatter = new GroundBloodSplatter( this.bloodSplatter.splashPositionX, this.bloodSplatter.splashPositionZ );

    };

    public update ( elapsedTime, fadingCoef, timeCoef ) : void {

        this.bloodSplatter.update( elapsedTime, timeCoef );

        if( this.bloodSplatter.bloodDisappear ) {

            this.delta = this.clock.getDelta() * 1000;
            this.elapsedTimeBlood += this.delta;

            this.groundBloodSplatter.update( elapsedTime, this.bloodSplatter.splashPositionX, this.bloodSplatter.splashPositionZ );
            this.groundBloodSplatter.material.uniforms.uVisibility.value = 1.0;
            this.groundBloodSplatter.material.uniforms.uFading.value = this.elapsedTimeBlood * 0.001 * fadingCoef;

        };

        this.groundBloodSplatter.geometry.attributes.transformRow1.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow2.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow3.needsUpdate = true;
        this.groundBloodSplatter.geometry.attributes.transformRow4.needsUpdate = true;

    };

};
