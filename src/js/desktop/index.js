import {
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  Scene,
  BoxGeometry,
  Mesh,
  Euler,
  Quaternion,
  ShaderMaterial,
  CubeTextureLoader,
  MeshLambertMaterial,
  CylinderGeometry
} from "three";
import * as THREE from "three";
import io from "socket.io-client";

import vertShader from './vert.glsl'
import fragShader from './frag.glsl'

const renderer = new WebGLRenderer({
  antialias: true
});
if (process.env.NODE_ENV === "development") {
  Array.from(document.body.querySelectorAll("canvas")).forEach(e =>
    document.body.removeChild(e)
  );
}
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new Color(0x010101));

const camera = new PerspectiveCamera(50, 1, 0.01, 1000);

window.addEventListener(
  "resize",
  (() => {
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    return resize;
  })()
);

camera.position.z = 40;

const scene = new Scene();

// Skybox

new CubeTextureLoader().load(
  [
    require("../../assets/frontImage.png"),
    require("../../assets/backImage.png"),
    require("../../assets/upImage.png"),
    require("../../assets/downImage.png"),
    require("../../assets/rightImage.png"),
    require("../../assets/leftImage.png")
  ],
  texture => {
    scene.background = texture;
  }
);

// Lightsaber
const lightGeo = new CylinderGeometry(.5, .5, 20, 32);
const lightMat = new MeshLambertMaterial({
	emissive: '#0000FF',
	reflectivity: 1,
	refractionRatio: 1
});

const lightSaber = new Mesh(lightGeo, lightMat);

scene.add(lightSaber);

// Point light
const light = new THREE.PointLight(0xffffff);
light.position.set(0,250,0);
scene.add(light);

// let lastTime = 0;
renderer.setAnimationLoop(/* time */ () => {
  /* time *= 0.001;
  const delta = time - lastTime;
  lastTime = time; */

  renderer.render(scene, camera);
});

const socket = io(window.location.href);

socket.on("rotation", data => {
  const rot = new Euler().setFromQuaternion(new Quaternion().fromArray(data));
  const { x, y, z } = rot;
  rot.z = -y;
  rot.y = -z;
  rot.x = x;
  camera.setRotationFromEuler(new Euler(rot.x * 0.1, rot.y * 0.1, rot.z * 0.1));
  lightSaber.setRotationFromEuler(rot);
});
