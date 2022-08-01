import { Color, ShaderMaterial, TextureLoader } from "three";

//

let loader = new TextureLoader();
let noise = loader.load( 'resources/textures/noise.png' );

export class BloodSplatterMaterial extends ShaderMaterial {

    constructor () {

        super();

        this.transparent = true,
        this.vertexShader = `
        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;
        varying float vBloodOpacity;

        uniform float uTime;
        uniform float uBloodTime;

        attribute vec4 transformRow1;
        attribute vec4 transformRow2;
        attribute vec4 transformRow3;
        attribute vec4 transformRow4;
        attribute float size;
        attribute float colorCoef;
        attribute float shape;
        attribute float bloodOpacity;

        void main () {

            mat4 transforms = mat4(
                transformRow1,
                transformRow2,
                transformRow3,
                transformRow4
            );

            gl_Position = projectionMatrix * ( modelViewMatrix * transforms * vec4( 0.0, 0.0, position.z, 1.0 ) + vec4( position * size * 0.7, 1.0 ) ); //2.3

            // gl_Position = projectionMatrix * ( modelViewMatrix * transforms * vec4( 0.0, 0.0, 0.0, 1.0 ) + vec4( pos, 1.0 ) );

            vUv = uv;
            vColorCoef = colorCoef;
            vShape = shape;
            vBloodOpacity = bloodOpacity;

        }`,
        this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;
        uniform float uFading;
        uniform vec3 uColorLight;
        uniform vec3 uColorDark;

        varying vec2 vUv;
        varying float vColorCoef;
        varying float vShape;
        varying float vBloodOpacity;

        void main () {

            // vec2 centeredUv = vec2( vec2( vUv.x * ( uTime * 0.0005 ) * 1.9 - 0.1, ( vUv.y * ( uTime * 0.0009 ) * 0.9 - 0.2 ) ) );
            vec2 centeredUv = vec2( vec2( vUv.x - 0.5, ( vUv.y - 0.5 ) * 1.7 ) );
            float distanceToCenter = length( centeredUv ) * 11.0;

            float noise = texture2D( uNoise, vUv ).r * 0.6;

            // if ( distanceToCenter * uTime * 0.0002 > noise * vShape + uTime * 0.0001 * noise ) { discard; };
            if ( distanceToCenter * uTime * 0.0002 + 0.1 > noise + uTime * 0.0001 * noise ) { discard; };

            //

            vec3 mixColor = mix( uColorLight, uColorDark, vec3( noise ) * vColorCoef * 1.0 );

            gl_FragColor.rgb = mixColor;
            gl_FragColor.a = ( 1.0 - uFading ) * vBloodOpacity; // * 0.001;
            if ( gl_FragColor.a < 0.0001 ) { discard; }

        }`,
        this.transparent = true,
        this.uniforms = {

            uNoise: { value: noise },
            uTime: { value: 0.0 },
            uColorLight: { value: new Color( 0xe32205 ) },
            uColorDark: { value: new Color( 0xe330802 ) },
            uBloodTime: { value: 0.1 },
            uFading: { value: 0.0 }

        }

    }

};
