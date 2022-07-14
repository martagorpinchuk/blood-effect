import { Clock, Object3D } from "three";
import { BloodSplatter } from "./BloodSplatter";
import { GroundBloodSplatter } from './GroundBloodSplatter';

//

export class BloodGfx {

    public bloodSplatter = new BloodSplatter();
    public groundBloodSplatter = new GroundBloodSplatter();
    public clock: Clock;
    public delta: number;
    public elapsedTimeBlood: number = 0;

    public wrapper: Object3D = new Object3D();

    constructor () {

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

        this.groundBloodSplatter = new GroundBloodSplatter();

    };

    public update ( elapsedTime ) : void {

        this.bloodSplatter.update( elapsedTime );

        if( this.bloodSplatter.bloodDisappear ) {

            this.delta = this.clock.getDelta() * 1000;
            this.elapsedTimeBlood += this.delta;

            this.groundBloodSplatter.update( elapsedTime );
            this.groundBloodSplatter.material.uniforms.uVisibility.value = 1.0;
            this.groundBloodSplatter.material.uniforms.uFading.value = this.elapsedTimeBlood * 0.001;

        };

    };

};
