import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

let elapsedTime = 0;

const textPosition = new THREE.Vector3();

// Debug
const gui = new dat.GUI();

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);

// Canvas
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// Texture loader
const textureLoader = new THREE.TextureLoader();

const backgroundImage = textureLoader.load(
  "/static/textures/matcaps/Pumpkin2.jpg"
);

scene.background = backgroundImage;

// Font loader
const fontLoader = new THREE.FontLoader();

fontLoader.load("/static/fonts/helvetiker_bold.typeface.json", (font) => {
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
  textGeometry.translate(-2, -0, 0);
  const text2Geometry = new THREE.TextGeometry("Web Developer", {
    font,
    size: 0.3,
    height: 0.1,
    curveSegments: 100,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.02,
    bevelOffset: 0.004,
    bevelSegments: 1.0
  });

  text2Geometry.translate(-2, -0.6, 0);

  const matcapTexture = textureLoader.load(
    "/static/textures/matcaps/Pumpkin.jfif"
  );

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
  });

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const text2 = new THREE.Mesh(text2Geometry, material);
  scene.add(text2);

  // Rest of scene setup
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.width / sizes.height,
  2,
  100
);

camera.position.set(1, 1, 8);
camera.aspect = sizes.width / sizes.height;
camera.updateProjectionMatrix();

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Light
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const tick = () => {
  elapsedTime += 0.009;

  camera.position.x = Math.sin(elapsedTime) * -1;
  camera.position.y = Math.cos(elapsedTime) * 5;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
