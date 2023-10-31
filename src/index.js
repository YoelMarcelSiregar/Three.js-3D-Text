import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);

// Canvas
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the image as a texture
const backgroundImage = textureLoader.load("/static/textures/matcaps/35.jfif");

// Set the scene background to the image texture
scene.background = backgroundImage;
/**
 * Objects
 */

let hearts = [];
const fontLoader = new THREE.FontLoader();
fontLoader.load(
  "/static/fonts/helvetiker_bold.typeface.json",
  // '/fonts/gentilis_regular.typeface.json',
  // '/fonts/optimer_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextGeometry("Lee Jackson", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 100,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.02,
      bevelOffset: 0.004,
      bevelSegments: 1.0
    });

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     textGeometry.boundingBox.max.x * -0.5,
    //     textGeometry.boundingBox.max.y * -0.5,
    //     textGeometry.boundingBox.max.z * -0.5,
    // )
    textGeometry.center(); // does the same things as above code
    const matcapTexture = textureLoader.load(
      "/static/textures/matcaps/35.jfif"
    );

    // Create a MeshMatcapMaterial with metallic properties
    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      metalness: 1 // Adjust the value as needed (0 to 1)
    });

    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const heartShape = new THREE.Shape();

    heartShape.moveTo(0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    heartShape.bezierCurveTo(0, 0, 0, 0, 0, 0);

    const matcap5Texture = textureLoader.load("/static/textures/matcaps/5.png");
    const matcap8Texture = textureLoader.load("/static/textures/matcaps/8.png");
    const matcap5 = new THREE.MeshMatcapMaterial({
      matcap: matcap5Texture
    });
    const matcap8 = new THREE.MeshMatcapMaterial({
      matcap: matcap8Texture
    });

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.0005,
      bevelEnabled: true,
      bevelSegments: 30,
      steps: 3,
      bevelSize: 0.01,
      bevelThickness: 0.01
    });

    const spread = 10;

    for (let i = 0; i < 100; i++) {
      const heart = new THREE.Mesh(geometry, matcap8);
      heart.position.x = (Math.random() - 0.5) * spread;
      heart.position.y = (Math.random() - 0.5) * spread;
      heart.position.z = (Math.random() - 0.5) * spread;
      heart.rotation.x = Math.random() * Math.PI;
      heart.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      heart.scale.set(scale, scale, scale);
      hearts.push(heart);
      scene.add(heart);
    }
  }
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
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

// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 2;
camera.position.z = 1;

// Update the camera's aspect ratio
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();

// Add the camera to the scene
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Add the ambient light to the scene
scene.add(directionalLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  hearts.forEach((heart) => {
    heart.rotation.x = elapsedTime;
    heart.rotation.y = elapsedTime;
  });

  camera.lookAt(0, 0, 0);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
