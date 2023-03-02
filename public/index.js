import * as THREE from "./three/build/three.module.js";
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.01,1000);
camera.position.set(0,5,3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight,)
document.querySelector("body").appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight);
function directionalLight(color,power) {
    const light = new THREE.DirectionalLight(color,power);
    scene.add(light);
    return light;
}

async function gltfLoader(url) {
    const loader = new GLTFLoader();

    const promise = new Promise((resolve)=> {
        loader.load(url,(m)=> {
            let model =  m.scene;
            scene.add(model);
            resolve(model);
        })
    })

    const model = await promise;
    return model;
    
}




function Pelota(x,y,z,sx,sy,sz) {
    this.pelota = {};
    gltfLoader("./modeles/ball.glb").then((r)=> {
        this.pelota = r;
    }); 
    
    this.sx = sx;
    this.sy = sy;
    this.sz = sz;

    window.addEventListener("keydown",(e)=> {
  
        switch (e.keyCode) {
            case 38:
                this.sz = this.sz * -1;
                break;
                case 40:
                    this.sz = Math.abs(this.sz);
                    break;
                    case 39:
                    this.sx = this.sx * -1;
                    break;
                    case 37:
                    this.sx = Math.abs(this.sx);
                
                    break;
                    case 32:
                    this.sy = 0.5;
                    break;
        
            default:
                break;
        }
    })
}
Pelota.prototype.update = function() {
    this.pelota.position.x += this.sx;
    this.pelota.position.z += this.sz;
    this.pelota.position.y += this.sy;
    if(this.pelota.position.y > 5) this.sy = this.sy * -1;
    if(this.pelota.position.y <= 0) this.sy = 0;
}

function Game() {
    this.pelotas = new Pelota(0,0,0,0.1,0,0.1);
    this.light1 = directionalLight(0xffffff,5);
}
Game.prototype.update = function() {
    this.pelotas.update();
}

const game = new Game();


function animate() {
    requestAnimationFrame(animate);
    game.update();
    controls.update();
    renderer.render(scene,camera);
}

animate();