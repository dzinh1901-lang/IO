import * as THREE from 'three';
import { ScaleRegime } from '../types/render';

export class SceneManager {
  public readonly root = new THREE.Group();
  public readonly backgroundGroup = new THREE.Group();
  public readonly orbitGroup = new THREE.Group();
  public readonly bodyGroup = new THREE.Group();
  public readonly populationGroup = new THREE.Group();

  public constructor(scene: THREE.Scene) {
    this.root.add(this.backgroundGroup, this.orbitGroup, this.bodyGroup, this.populationGroup);
    scene.add(this.root);
  }

  public applyRegime(regime: ScaleRegime): void {
    this.backgroundGroup.visible = regime !== 'planetary';
    this.orbitGroup.visible = regime !== 'galactic';
    this.populationGroup.visible = regime !== 'galactic';
  }
}
