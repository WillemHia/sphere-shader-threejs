import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import textVertexShader from './shaders/vertex';
import textFragmentShader from './shaders/fragment';
import Stats from 'stats.js';

export default function sphereDance() {
    const scene = new THREE.Scene();
    const gui = new dat.GUI({ width: 300 });
    const stats = new Stats();
    document.body.appendChild(stats.dom);


    const debugObject = {};
    debugObject.surfaceColor = '#fe004d';
    debugObject.deepColor = '#ffffff';
    const canvas = document.querySelector('.webgl');
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 4.5;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const geometry = new THREE.SphereGeometry(1, 512, 512);

    const material = new THREE.ShaderMaterial({
        vertexShader: textVertexShader,
        fragmentShader: textFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uDeepColor: { value: new THREE.Color(debugObject.deepColor) },
            uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
            uColorOffset: { value: 0.4 },
            uColorMultiplier: { value: 2 },
            uWavesElevation: { value: 0.18 },
            uWavesFrequency: { value: 3.0 },
            uWavesSpeed: { value: 0.2 }
        }
    })


    gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
    gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');
    gui.add(material.uniforms.uWavesElevation, 'value').min(0).max(0.5).step(0.0001).name('uElevation');
    gui.add(material.uniforms.uWavesFrequency, 'value').min(0).max(10).step(0.001).name('uFrequency');
    gui.add(material.uniforms.uWavesSpeed, 'value').min(0).max(10).step(0.001).name('uSpeed');
    gui.addColor(debugObject, 'deepColor').onChange(() => {
        material.uniforms.uDeepColor.value.set(debugObject.deepColor);
    });
    gui.addColor(debugObject, 'surfaceColor').onChange(() => {
        material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const clock = new THREE.Clock();


    const tick = () => {


        stats.begin();

        const elapsedTime = clock.getElapsedTime();


        // Update material
        material.uniforms.uTime.value = elapsedTime;

        // Update Orbital Controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
        stats.end();
    }

    tick();
} 