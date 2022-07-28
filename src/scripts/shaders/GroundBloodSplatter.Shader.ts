import { Color, ShaderMaterial, TextureLoader } from "three";

//

let loader = new TextureLoader();
let noise = loader.load( 'resources/textures/noise.png' );

export class GroundBloodSplatterMaterial extends ShaderMaterial {

    constructor () {

        super();

        this.transparent = true,
        this.vertexShader = `
        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;

        uniform float uTime;
        uniform float uBloodTime;

        attribute vec4 transformRow1;
        attribute vec4 transformRow2;
        attribute vec4 transformRow3;
        attribute vec4 transformRow4;
        attribute float size;
        attribute float colorCoef;
        attribute float shape;

        void main () {

            mat4 transforms = mat4(
                transformRow1,
                transformRow2,
                transformRow3,
                transformRow4
            );

            vec3 pos = position;

            gl_Position = projectionMatrix * modelViewMatrix * transforms * vec4( pos * size, 1.0 );

            vUv = uv;
            vColorCoef = colorCoef;
            vShape = shape;

        }`,
        this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform float uFading;
        uniform float uVisibility;
        uniform vec3 uColorLight;
        uniform vec3 uColorDark;

        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;

        void main () {

            vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 1.2 ) );
            float distanceToCenter = length( centeredUv );

            float noise = texture2D( uNoise, vUv ).r * 0.6;

            if ( distanceToCenter > noise * vShape ) { discard; };

            //

            vec3 mixColor = mix( uColorLight, uColorDark, vec3( noise ) * vColorCoef * 1.0 );

            gl_FragColor.rgb = mixColor;
            gl_FragColor.a = ( 1.0 - uFading * noise * 2.3 ) * uVisibility; // * 0.001;

        }`,
        this.transparent = true,
        this.uniforms = {

            uNoise: { value: noise },
            uTime: { value: 0.0 },
            uColorLight: { value: new Color( 0xe32205 ) },
            uColorDark: { value: new Color( 0xe330802 ) },
            uBloodTime: { value: 0.1 },
            uFading: { value: 0.0 },
            uVisibility: { value: 0.0 }

        }

    }

};
