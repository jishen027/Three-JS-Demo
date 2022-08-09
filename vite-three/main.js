import * as THREE from 'three'

import { PointerLockControls } from '../three-m-js/PointerLockControls';

let controls, renderer, camera, scene, raycaster, pointer;

let INTERSECTED;

init();
animate();

function init() {
  // crosshair
  const crosshair = document.getElementById('crosshair');
  crosshair.innerHTML = '+';
  crosshair.style.display = 'none';

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.y = 10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  //light
  const amientLight = new THREE.AmbientLight();
  scene.add(amientLight);

  const pointLight = new THREE.PointLight();
  pointLight.position.set(1000, 1000, 1000);
  scene.add(pointLight);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    crosshair.style.display = 'block';
  });

  controls.addEventListener('unlock', () => {
    blocker.style.display = 'block';
    instructions.style.display = '';
    crosshair.style.display = 'none';
  });

  //floor
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  //grid helper
  const helper = new THREE.GridHelper(2000, 100);
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  //object
  const geometry = new THREE.SphereGeometry(10, 32, 16);
  const material = new THREE.MeshLambertMaterial({
    color: '#95a5a6',
    transparent: true,
    opacity: 0.8
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = Math.floor(Math.random() * 20 - 10) * 10;
  sphere.position.y = Math.floor(Math.random() * 20) * 10 + 10;
  sphere.position.z = Math.floor(Math.random() * 20 - 10) * 10;
  scene.add(sphere);

  //raycaster
  pointer = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  aimObject();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function aimObject() {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) {
        INTERSECTED.material.color.set('#95a5a6');
        INTERSECTED.material.transparent = true;
        INTERSECTED.material.opacity = 0.8;
      }
      INTERSECTED = intersects[0].object;
      INTERSECTED.material.color.set('#e74c3c');
      INTERSECTED.material.transparent = true;
      INTERSECTED.material.opacity = 0.5;
    }

  } else {
    if (INTERSECTED) {
      INTERSECTED.material.color.set('#95a5a6');
      INTERSECTED.material.transparent = true;
      INTERSECTED.material.opacity = 0.8;
    }
    INTERSECTED = null;
  }
}
function shootingAction(event) {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
    intersects[0].object.position.x = Math.floor(Math.random() * 20 - 10) * 10;
    intersects[0].object.position.y = Math.floor(Math.random() * 20) * 10 + 10;
    intersects[0].object.position.z = Math.floor(Math.random() * 20 - 10) * 10;
  }
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', shootingAction);