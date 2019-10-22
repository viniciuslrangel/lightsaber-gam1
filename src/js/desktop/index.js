import {
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  Scene,
  Euler,
  CubeTextureLoader,
  Quaternion,
  Vector3
} from "three";
import * as THREE from "three";
import io from "socket.io-client";
import LightSaber from "./lightSaber";

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
camera.position.z = 40;
camera.lookAt(0, 0, 0);

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

const lightSaber = (window.saber = new LightSaber());
scene.add(lightSaber);

// Point light
const light = new THREE.PointLight(0xffffff);
light.position.set(0, 250, 0);
scene.add(light);

// let lastTime = 0;
renderer.setAnimationLoop(
  /* time */ () => {
    /* time *= 0.001;
  const delta = time - lastTime;
  lastTime = time; */

    renderer.render(scene, camera);
  }
);

const socket = io(window.location.href);

// const axis = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0).normalize(), Math.PI / 2)
const q1 = new Quaternion();
const axis1 = new Vector3(0, 1, 0);
const q2 = new Quaternion();
const axis2 = new Vector3(0, 0, 1);

socket.on("rotation", data => {
  q1.setFromAxisAngle(axis1, (-data.gamma * Math.PI) / 180);
  q2.setFromAxisAngle(axis2, (data.beta * Math.PI) / 180 - Math.PI / 2);
  lightSaber.setRotationFromQuaternion(q1.multiply(q2));
});

socket.on("motion", data => {
  camera.rotation.z = camera.rotation.z * 0.9 + (data * Math.PI / 180 * 0.1) * 0.1
})
