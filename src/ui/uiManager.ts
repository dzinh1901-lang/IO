export interface UiCallbacks {
  onSearch: (query: string) => void;
  onFocus: (bodyId: string) => void;
  onPauseToggle: () => void;
  onSetTimeScale: (scale: number) => void;
  onScrubToIso: (iso: string) => void;
  onResetNow: () => void;
  onStrictScaleToggle: (strict: boolean) => void;
}

export interface UiSnapshot {
  focusName: string;
  regime: string;
  distanceLabel: string;
  timeIso: string;
  kmPerUnit: number;
  visualScalingActive: boolean;
  strictTrueScale: boolean;
  scaledBodies: string[];
  searchResults: Array<{ id: string; name: string }>;
  paused: boolean;
  timeScale: number;
}

export class UIManager {
  private readonly focusValue: HTMLElement;
  private readonly regimeValue: HTMLElement;
  private readonly distanceValue: HTMLElement;
  private readonly timeValue: HTMLInputElement;
  private readonly scaleValue: HTMLElement;
  private readonly scalingValue: HTMLElement;
  private readonly results: HTMLElement;
  private readonly speedSelect: HTMLSelectElement;
  private readonly pauseButton: HTMLButtonElement;
  private readonly strictScaleToggle: HTMLInputElement;

  public constructor(container: HTMLElement, callbacks: UiCallbacks) {
    container.innerHTML = `
      <div class="app-shell">
        <canvas id="scene-canvas"></canvas>
        <aside class="hud">
          <div class="panel brand">
            <h1>IO Spatial Engine</h1>
            <p>Placeholder Solar System data with floating-origin rendering.</p>
          </div>
          <div class="panel controls">
            <label>
              <span>Search major bodies</span>
              <input id="search-input" type="search" placeholder="Earth, Mars, Saturn..." />
            </label>
            <div id="search-results" class="search-results"></div>
          </div>
          <div class="panel state-grid">
            <div><span>Focus</span><strong id="focus-value"></strong></div>
            <div><span>Regime</span><strong id="regime-value"></strong></div>
            <div><span>Distance</span><strong id="distance-value"></strong></div>
            <div><span>Scale</span><strong id="scale-value"></strong></div>
            <div><span>Visual scaling</span><strong id="scaling-value"></strong></div>
          </div>
          <div class="panel controls">
            <div class="time-row">
              <button id="pause-button" type="button">Pause</button>
              <label>
                <span>Playback</span>
                <select id="speed-select">
                  <option value="0.25">0.25×</option>
                  <option value="1" selected>1×</option>
                  <option value="10">10×</option>
                  <option value="100">100×</option>
                  <option value="1000">1000×</option>
                </select>
              </label>
            </div>
            <label>
              <span>Scrub time</span>
              <input id="time-input" type="datetime-local" step="1" />
            </label>
            <div class="time-row">
              <button id="scrub-now-button" type="button">Reset to now</button>
              <label class="toggle-row">
                <input id="strict-scale-toggle" type="checkbox" />
                <span>Strict true scale</span>
              </label>
            </div>
          </div>
          <div class="panel footer-note">
            <small>TODO: swap provisional datasets for offline-generated SPICE ephemerides and textures.</small>
          </div>
        </aside>
      </div>
    `;

    this.focusValue = container.querySelector('#focus-value') as HTMLElement;
    this.regimeValue = container.querySelector('#regime-value') as HTMLElement;
    this.distanceValue = container.querySelector('#distance-value') as HTMLElement;
    this.timeValue = container.querySelector('#time-input') as HTMLInputElement;
    this.scaleValue = container.querySelector('#scale-value') as HTMLElement;
    this.scalingValue = container.querySelector('#scaling-value') as HTMLElement;
    this.results = container.querySelector('#search-results') as HTMLElement;
    this.speedSelect = container.querySelector('#speed-select') as HTMLSelectElement;
    this.pauseButton = container.querySelector('#pause-button') as HTMLButtonElement;
    this.strictScaleToggle = container.querySelector('#strict-scale-toggle') as HTMLInputElement;

    const searchInput = container.querySelector('#search-input') as HTMLInputElement;
    const scrubNowButton = container.querySelector('#scrub-now-button') as HTMLButtonElement;

    searchInput.addEventListener('input', () => callbacks.onSearch(searchInput.value));
    this.pauseButton.addEventListener('click', () => callbacks.onPauseToggle());
    this.speedSelect.addEventListener('change', () => {
      callbacks.onSetTimeScale(Number(this.speedSelect.value));
    });
    this.timeValue.addEventListener('change', () => {
      if (this.timeValue.value) {
        callbacks.onScrubToIso(this.timeValue.value);
      }
    });
    scrubNowButton.addEventListener('click', () => callbacks.onResetNow());
    this.strictScaleToggle.addEventListener('change', () => {
      callbacks.onStrictScaleToggle(this.strictScaleToggle.checked);
    });

    this.results.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>('button[data-body-id]');
      if (button?.dataset.bodyId) {
        callbacks.onFocus(button.dataset.bodyId);
      }
    });
  }

  public getCanvas(): HTMLCanvasElement {
    return document.querySelector('#scene-canvas') as HTMLCanvasElement;
  }

  public render(snapshot: UiSnapshot): void {
    this.focusValue.textContent = snapshot.focusName;
    this.regimeValue.textContent = snapshot.regime.replace('_', ' ');
    this.distanceValue.textContent = snapshot.distanceLabel;
    this.scaleValue.textContent = `${snapshot.kmPerUnit.toExponential(3)} km/unit`;
    this.scalingValue.textContent = snapshot.visualScalingActive
      ? `scaled: ${snapshot.scaledBodies.join(', ')}`
      : snapshot.strictTrueScale
        ? 'strict physical scale'
        : 'none';
    this.timeValue.value = snapshot.timeIso.slice(0, 19);
    this.pauseButton.textContent = snapshot.paused ? 'Resume' : 'Pause';
    this.speedSelect.value = String(snapshot.timeScale);
    this.strictScaleToggle.checked = snapshot.strictTrueScale;
    this.results.innerHTML = snapshot.searchResults
      .map(
        (body) =>
          `<button type="button" class="search-item" data-body-id="${body.id}">${body.name}</button>`
      )
      .join('');
  }
}
