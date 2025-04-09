import * as THREE from "three";
import * as YUKA from "yuka";

//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MapControls } from "./js/three/examples/jsm/controls/MapControls.js";
import { GLTFLoader } from "./js/three/examples/jsm/loaders/GLTFLoader.js";
//import { modelScale } from "three/tsl";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "./js/three/examples/jsm/renderers/CSS2DRenderer.js";
//import { update } from "three/examples/jsm/libs/tween.module.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//couleur arrière-plan
renderer.setClearColor(0xf6f6f6);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  15000
);

// Ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// set controls
const controls = new MapControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 2500;
controls.maxTargetRadius = 1200;

//positionnement camera
camera.position.set(0, 1500, 4000);
camera.lookAt(0, 0, 0);

//train
const vehicleGeometry = new THREE.ConeGeometry(51, 55, 58);
vehicleGeometry.rotateX(Math.PI * 0.5);
const vehicleMaterial = new THREE.MeshNormalMaterial();
const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
vehicleMesh.matrixAutoUpdate = false;
scene.add(vehicleMesh);

const vehicle = new YUKA.Vehicle();

vehicle.setRenderComponent(vehicleMesh, sync);

function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add(new YUKA.Vector3(10000, 0, -3450));
path.add(new YUKA.Vector3(-500, 0, 620));
path.add(new YUKA.Vector3(-700, 0, 800));
path.add(new YUKA.Vector3(-2000, 0, 2500));
console.log(path.current());
//path.add(new YUKA.Vector3(2000, 0, -400));
//path.add(new YUKA.Vector3(500, 0, 0));
//path.add(new YUKA.Vector3(0, 0, 1050));
//path.add(new YUKA.Vector3(-500, 0, 550));
//path.add(new YUKA.Vector3(-1500, 0, 1000));
//path.add(new YUKA.Vector3(-3000, 0, 2050));

path.loop = true;

vehicle.position.copy(path.current());
vehicle.updateOrientation = true;
vehicle.rotationType = 1;

vehicle.maxSpeed = 5500;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const position = [];
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(position, 3)
);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000000 });
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

const time = new YUKA.Time();

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

//link
var link = "http://google.com";
var element = document.createElement("a");
element.setAttribute("href", link);
element.innerHTML = "your text";

function createPointMesh(name, x, y, z) {
  const geo = new THREE.SphereGeometry(50, 50, 50);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true,
    //fog: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.name = name;
  return mesh;
}

const group = new THREE.Group();

const friche = createPointMesh("friche", -250, 100, 600);
group.add(friche);
friche.userData = { URL: "http://stackoverflow.com" };
const vEtudiante = createPointMesh("vEtudiante", -650, 100, 1300);
group.add(vEtudiante);
scene.add(group);

// text
const p = document.createElement("p");
p.className = "area";
const pContainer = document.createElement("div");
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
scene.add(cPointLabel);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mouse.x = (e.clientX / this.window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (intersects[0].object.name == "friche") {
      p.className = "area show";
      cPointLabel.position.set(-250, 160, 600);
      p.textContent = "Friche";
    }
    if (intersects[0].object.name == "vEtudiante") {
      p.className = "area show";
      cPointLabel.position.set(-650, 160, 1300);
      p.textContent = "Ville étudiante";
    }
  } else {
    p.className = "area hide";
  }
});

window.addEventListener("mousedown", function onDocumentMouseDown(event) {
  mouse.x = (event.clientX / this.window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / this.window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    switch (intersects[0].object) {
      case friche:
        window.open("http://google.com");
        break;
      case vEtudiante:
        window.open("http://yahoo.com");
        break;
    }
  }
});

const loader = new GLTFLoader();

loader.load("./src/assets/sevran.gltf", function (glb) {
  const model = glb.scene;
  scene.add(model);
});

function animate() {
  controls.update();
  labelRenderer.render(scene, camera);
  const delta = time.update().getDelta();
  entityManager.update(delta);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
});
