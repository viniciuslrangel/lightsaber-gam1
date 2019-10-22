import { Object3D, CylinderGeometry, MeshStandardMaterial, Mesh } from "three";

export default class LightSaber extends Object3D {
  constructor() {
    super();

    const gripGeo = new CylinderGeometry(0.5, 0.5, 2, 32);
    const gripMat = new MeshStandardMaterial({
      color: "#636363",
      emissive: "#636363",
      roughness: 1,
      metalness: 0
    });

    this.grip = new Mesh(gripGeo, gripMat);
    this.grip.position.y = -5;
    this.add(this.grip);

    // Lightsaber
    const plasmaGeo = new CylinderGeometry(0.5, 0.5, 20, 32);
    const plasmaMat = new MeshStandardMaterial({
      color: "#006496",
      emissive: "#0095C4",
      roughness: 0.5,
      metalness: 0.5
    });
    this.plasma = new Mesh(plasmaGeo, plasmaMat);
    this.plasma.position.y = 6;
    this.add(this.plasma);
  }
}
