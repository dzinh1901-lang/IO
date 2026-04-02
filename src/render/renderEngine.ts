import * as THREE from 'three';
import { formatDistance } from '../core/units';
import { BodyRenderOptions, RenderContext } from '../types/render';
import { TruthStore } from '../truth/truthStore';
import { tdbSToCalendarDate } from '../core/time';
import { CameraController } from './cameraController';
import { ScaleManager } from './scaleManager';
import { SceneManager } from './sceneManager';
import { BodyRenderer } from './modules/bodyRenderer';
import { OrbitRenderer } from './modules/orbitRenderer';
import { PointPopulationRenderer } from './modules/pointPopulationRenderer';
import { StarfieldRenderer } from './modules/starfieldRenderer';

export interface RenderFrameSummary {
  focusName: string;
  focusBodyId: string | null;
  regime: string;
  distanceLabel: string;
  timeIso: string;
  scaledBodies: string[];
  kmPerUnit: number;
  visualScalingActive: boolean;
}

export class RenderEngine {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(60, 1, 0.001, 1_000_000);
  private readonly cameraController: CameraController;
  private readonly scaleManager = new ScaleManager();
  private readonly sceneManager: SceneManager;
  private readonly bodyRenderer: BodyRenderer;
  private readonly orbitRenderer: OrbitRenderer;
  private readonly pointPopulationRenderer: PointPopulationRenderer;
  private readonly starfieldRenderer: StarfieldRenderer;
  private readonly options: BodyRenderOptions = {
    minVisualRadiusPx: 5,
    strictTrueScale: false,
  };

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly truthStore: TruthStore
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x02040a);
    this.cameraController = new CameraController(this.canvas);
    this.sceneManager = new SceneManager(this.scene);
    this.bodyRenderer = new BodyRenderer(this.sceneManager.bodyGroup, truthStore.getBodies());
    this.orbitRenderer = new OrbitRenderer(this.sceneManager.orbitGroup);
    this.pointPopulationRenderer = new PointPopulationRenderer(this.sceneManager.populationGroup);
    this.starfieldRenderer = new StarfieldRenderer(this.sceneManager.backgroundGroup);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    this.scene.add(new THREE.HemisphereLight(0x8bb2ff, 0x0a0a12, 0.6));
    this.camera.position.set(0, 0, 0);
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  public setStrictTrueScale(value: boolean): void {
    this.options.strictTrueScale = value;
  }

  public focusBody(bodyId: string): void {
    const body = this.truthStore.getBody(bodyId);
    if (body) {
      this.cameraController.flyTo(bodyId, body.physics.radiusKm);
    }
  }

  public renderFrame(simTimeTdbS: number, deltaS: number): RenderFrameSummary {
    const cameraView = this.cameraController.update(deltaS, this.truthStore, simTimeTdbS);
    const scale = this.scaleManager.compute(cameraView.cameraTruthKm, cameraView.distanceKm);
    this.camera.near = scale.cameraNear;
    this.camera.far = scale.cameraFar;
    this.camera.updateProjectionMatrix();

    const targetWorld = new THREE.Vector3(
      (cameraView.targetTruthKm[0] - scale.originKm[0]) / scale.kmPerUnit,
      (cameraView.targetTruthKm[1] - scale.originKm[1]) / scale.kmPerUnit,
      (cameraView.targetTruthKm[2] - scale.originKm[2]) / scale.kmPerUnit
    );
    this.camera.lookAt(targetWorld);

    const context: RenderContext = {
      scale,
      scene: this.scene,
      camera: this.camera,
      simTimeTdbS,
      deltaS,
      focusBodyId: cameraView.focusBodyId,
    };

    this.sceneManager.applyRegime(scale.regime);
    this.bodyRenderer.update(context, this.truthStore, this.canvas.clientHeight, this.options);
    this.orbitRenderer.update(context, this.truthStore);
    this.pointPopulationRenderer.update(context);
    this.starfieldRenderer.update(context);
    this.renderer.render(this.scene, this.camera);

    const focusBody = cameraView.focusBodyId ? this.truthStore.getBody(cameraView.focusBodyId) : undefined;
    const scaledBodies = this.bodyRenderer.getScaledBodies();
    return {
      focusName: focusBody?.name ?? 'Free camera',
      focusBodyId: cameraView.focusBodyId,
      regime: scale.regime,
      distanceLabel: formatDistance(cameraView.distanceKm),
      timeIso: tdbSToCalendarDate(simTimeTdbS).iso,
      scaledBodies,
      kmPerUnit: scale.kmPerUnit,
      visualScalingActive: scaledBodies.length > 0,
    };
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
