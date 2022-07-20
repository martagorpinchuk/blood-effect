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
    // public fadingCoef: number = 1;

    public wrapper: Object3D = new Object3D();

    constructor ( fadingCoef, timeCoef ) {

        this.clock = new Clock();

        this.addBloodSplatter();
        this.addGroundBloodSplatter();

        // this.debug();

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

    // public debug () : void {

    //     const props = {

    //         bloodGroundColor: '#ff0000',
    //         bloodColor: '#ff0000'

    //     };

    //     let pane = new Pane(  { title: "Explosion" } ); //  expanded: false
    //     pane.element.parentElement.style['width'] = '330px';

    //     let color = pane.addFolder( { title: "Blood color" } );
    //     let bloodSpeed = pane.addFolder( { title: "Speed" } );

    //     color.addInput( props, 'bloodGroundColor', { label: 'Ground blood color' } ).on( 'change', () => {

    //         this.groundBloodSplatter.material.uniforms.uColorLight.value.setHex( parseInt( props.bloodGroundColor.replace( '#', '0x' ) ) );

    //     } );

    //     color.addInput( props, 'bloodColor', { label: 'Blood color' } ).on( 'change', () => {

    //         this.groundBloodSplatter.material.uniforms.uColorLight.value.setHex( parseInt( props.bloodColor.replace( '#', '0x' ) ) );

    //     } );

    //     //

    //     bloodSpeed.addInput( this.bloodSplatter, 'timeCoef', { min: 0.01, max: 2, label: 'Falling blood speed' } );
    //     bloodSpeed.addInput( this, 'fadingCoef', { min: 0.01, max: 2, label: 'Falling blood speed' } );

    // };

};
