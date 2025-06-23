import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 20 fixed camera-facing orientations that simulate each face being "up"
const D20_ROTATIONS = [
  new THREE.Euler(0, 0, 0),
  new THREE.Euler(1, 0.3, 0.5),
  new THREE.Euler(2, 1, 0),
  new THREE.Euler(1.8, -1, 0.2),
  new THREE.Euler(0.8, 1.3, -1),
  new THREE.Euler(0.5, 1.8, 0.5),
  new THREE.Euler(2.1, 0.2, -0.5),
  new THREE.Euler(-0.8, 0.5, -1.2),
  new THREE.Euler(-1.5, 0.6, 1.3),
  new THREE.Euler(0.6, -1.3, 2),
  new THREE.Euler(-2, 0.5, 1),
  new THREE.Euler(1.2, -2, -0.3),
  new THREE.Euler(0.4, 2.1, 1.5),
  new THREE.Euler(-1.4, 1.2, -0.5),
  new THREE.Euler(-0.5, -1.6, 0.7),
  new THREE.Euler(1.5, 1.2, -1.1),
  new THREE.Euler(2, -1, 1.8),
  new THREE.Euler(-1, -0.4, -1.6),
  new THREE.Euler(0.3, -1.2, -2),
  new THREE.Euler(-2.3, -0.5, 1),
];

export function setupD20Roller(canvasId) {
  const canvas = document.getElementById(canvasId);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;

  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.6);
  directional.position.set(3, 4, 5);
  scene.add(directional);

  // D20 mesh
  const radius = 0.8;
  const d20Geo = new THREE.IcosahedronGeometry(radius, 0);
  const d20Mat = new THREE.MeshStandardMaterial({ color: 0x8a2be2, flatShading: true }); // purple
  const d20Mesh = new THREE.Mesh(d20Geo, d20Mat);
  scene.add(d20Mesh);

  // Floating number
  const numberLabel = document.createElement('div');
  numberLabel.id = 'd20-number';
  numberLabel.style.position = 'absolute';
  numberLabel.style.top = '0';
  numberLabel.style.left = '0';
  numberLabel.style.width = '100%';
  numberLabel.style.height = '100%';
  numberLabel.style.display = 'flex';
  numberLabel.style.alignItems = 'center';
  numberLabel.style.justifyContent = 'center';
  numberLabel.style.fontSize = '1.75rem';
  numberLabel.style.color = '#ffffff';
  numberLabel.style.fontWeight = 'bold';
  numberLabel.style.pointerEvents = 'none';
  numberLabel.style.zIndex = '20';
  numberLabel.style.textShadow = '0 0 8px black';
  numberLabel.textContent = '';
  canvas.style.position = 'relative';
  canvas.parentElement.style.position = 'relative';
  canvas.parentElement.appendChild(numberLabel);

  let isRolling = false;
  let rotationSpeed = new THREE.Vector3();

  document.getElementById('roll-button').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    // Start spin
    rotationSpeed.set(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    );

    numberLabel.textContent = '';

    // End spin and snap
    const roll = Math.floor(Math.random() * 20);
    setTimeout(() => {
      isRolling = false;
      d20Mesh.rotation.copy(D20_ROTATIONS[roll]);
      numberLabel.textContent = (roll + 1).toString();
    }, 1000);
  });

  function animate() {
    requestAnimationFrame(animate);

    if (isRolling) {
      d20Mesh.rotation.x += rotationSpeed.x;
      d20Mesh.rotation.y += rotationSpeed.y;
      d20Mesh.rotation.z += rotationSpeed.z;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
