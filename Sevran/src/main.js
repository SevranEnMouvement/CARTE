import * as THREE from "three";
//import * as YUKA from "yuka";

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
//friche.userData = { URL: "http://stackoverflow.com" };
const m16 = createPointMesh("m16", -1300, 100, 580);
group.add(m16);
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
    if (intersects[0].object.name == "m16") {
      p.className = "area show";
      cPointLabel.position.set(-1300, 100, 580);
      p.textContent = "Métro 16";
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
        window.open("https://sevran-en-mouvement.mastercmw.com/friche/");
        break;
      case m16:
        window.open("https://sevran-en-mouvement.mastercmw.com/ligne-16/");
        break;
      case vEtudiante:
        window.open(
          "https://sevran-en-mouvement.mastercmw.com/ville-etudiante/"
        );
        break;
    }
  }
});

const loader = new GLTFLoader();

loader.load("./sevran.gltf", function (glb) {
  const model = glb.scene;
  scene.add(model);
});

function animate() {
  controls.update();
  labelRenderer.render(scene, camera);
  //const delta = time.update().getDelta();
  //entityManager.update(delta);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
});
