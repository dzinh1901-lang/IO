import { applyTimeCommand, createInitialTimeState, tickTimeState } from '../core/time';
import { PLACEHOLDER_SOLAR_SYSTEM_BODIES } from '../data/placeholders/solarSystemCatalog';
import { TruthStore } from '../truth/truthStore';
import { PlaceholderEphemerisProvider } from '../truth/ephemerisProvider';
import { RenderEngine } from '../render/renderEngine';
import { UIManager } from '../ui/uiManager';

export class App {
  private readonly truthStore = new TruthStore(
    PLACEHOLDER_SOLAR_SYSTEM_BODIES,
    new PlaceholderEphemerisProvider(PLACEHOLDER_SOLAR_SYSTEM_BODIES)
  );
  private readonly ui: UIManager;
  private readonly renderEngine: RenderEngine;
  private timeState = createInitialTimeState();
  private strictTrueScale = false;
  private searchQuery = '';
  private lastFrameMs = performance.now();

  public constructor(root: HTMLElement) {
    this.ui = new UIManager(root, {
      onSearch: (query): void => {
        this.searchQuery = query;
      },
      onFocus: (bodyId): void => {
        this.renderEngine.focusBody(bodyId);
      },
      onPauseToggle: (): void => {
        this.timeState = this.timeState.paused
          ? applyTimeCommand(this.timeState, { type: 'RESUME' })
          : applyTimeCommand(this.timeState, { type: 'PAUSE' });
      },
      onSetTimeScale: (scale): void => {
        this.timeState = applyTimeCommand(this.timeState, { type: 'SET_SCALE', scale });
      },
      onScrubToIso: (iso): void => {
        const date = new Date(iso);
        if (!Number.isNaN(date.getTime())) {
          const tdbS = (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0, 0)) / 1000 + 69.184;
          this.timeState = applyTimeCommand(this.timeState, { type: 'SCRUB', tdbS });
        }
      },
      onResetNow: (): void => {
        this.timeState = applyTimeCommand(this.timeState, { type: 'RESET_TO_NOW' });
      },
      onStrictScaleToggle: (strict): void => {
        this.strictTrueScale = strict;
        this.renderEngine.setStrictTrueScale(strict);
      },
    });
    this.renderEngine = new RenderEngine(this.ui.getCanvas(), this.truthStore);
    this.renderEngine.focusBody('sun');
  }

  public start(): void {
    requestAnimationFrame(this.frame);
  }

  private readonly frame = (timestampMs: number): void => {
    const deltaS = Math.min((timestampMs - this.lastFrameMs) / 1000, 0.25);
    this.lastFrameMs = timestampMs;
    this.timeState = tickTimeState(this.timeState);
    const summary = this.renderEngine.renderFrame(this.timeState.tdbS, deltaS);
    const searchResults = this.truthStore
      .searchBodies(this.searchQuery)
      .filter((body) => body.class !== 'barycenter')
      .slice(0, 8)
      .map((body) => ({ id: body.id, name: body.name }));
    this.ui.render({
      ...summary,
      strictTrueScale: this.strictTrueScale,
      searchResults,
      paused: this.timeState.paused,
      timeScale: this.timeState.scale,
    });
    requestAnimationFrame(this.frame);
  };
}
