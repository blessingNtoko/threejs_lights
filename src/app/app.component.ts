import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { ColorGUIHelper } from './ColorGuiHelper/guiHelper.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);
  public controls = new OrbitControls(this.camera, this.renderer.domElement);
  public textureLoader = new THREE.TextureLoader();

  ngOnInit(){
    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls.target.set(0, 5, 0);
    this.controls.update();

    this.camera.position.set(0, 10, 20);

    const planeSize = 40;

    const texture = this.textureLoader.load('../assets/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    {
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({
        color: '#8ac'
      });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      this.scene.add(mesh);
    }

    {
      const sphereRadius = 3;
      const sphereWidthDiv = 32;
      const sphereHeightDiv = 16;
      const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDiv, sphereHeightDiv);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: '#ca8'
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      this.scene.add(mesh);
    }

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      // color: 'blue',
      side: THREE.DoubleSide
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -.5;
    this.scene.add(planeMesh);

    // =================================================================== Lights =================================================================

    // const color = 0xB1E1FF
    // const intensity = 1;
    // const light = new THREE.AmbientLight(color, intensity);
    // this.scene.add(light);

    // const skyColor = 0xB1E1FF
    // const groundColor = 0xB97A20;
    // const intensity = 1;
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    // this.scene.add(light);

    const color = 0xFFFFFF
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);

    // =================================================================== dat.GUI =================================================================

    const gui = new dat.GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.1);
    gui.add(light.target.position, 'x', -10, 10);
    gui.add(light.target.position, 'y', -10, 10);
    gui.add(light.target.position, 'z', 0, 10);

    // =================================================================== Animate =================================================================

    const animate = () => {

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate);

  }
}
