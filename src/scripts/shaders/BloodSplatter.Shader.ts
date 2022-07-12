import { ShaderMaterial, TextureLoader } from "three";

//

let loader = new TextureLoader();
let noise = loader.load( 'resources/textures/noise.png' );

export class BloodSplatterMaterial extends ShaderMaterial {

    constructor () {

        super();

        this.transparent = true,
        this.vertexShader = `
        varying vec2 vUv;

        void main () {

            gl_Position = vec4( position, 1.0 );

            vUv = uv;

        }`,
        this.fragmentShader = `
        uniform sampler2D uNoise;
        uniform float uTime;

        varying vec2 vUv;

        void main () {

            vec2 centeredUv = vec2( vUv - 0.5 );
            float distanceToCenter = length( centeredUv );

            float noise = texture2D( uNoise, vUv ).r;

            if ( distanceToCenter > noise + uTime * 0.1 ) { discard; };

            gl_FragColor = vec4( 0.1, 0.0, 0.1, 1.0 );

        }`,
        this.uniforms = {

            uNoise: { value: noise },
            uTime: { value: 0.0 }

        }

    }

};
