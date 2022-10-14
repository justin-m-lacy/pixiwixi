import { Container, Loader, Ticker } from 'pixi.js';

export class ProgressBar extends Container {

	get loader() { return this._loader; }

	/**
	 * {number}
	 */
	get progress() { return this._loader?.progress ?? 0; }

	/**
	 * {Boolean}
	 */
	get loading() { return this._loader && this._loading === true; }

	/**
	 * {Boolean}
	 */
	get isComplete(): boolean { return this._complete; }

	private _loader?: Loader;
	private _loading: boolean = false;
	private _complete: boolean = false;

	/**
	 * Ticker used to advanced progress bar.
	 * Defaults to PIXI.Ticker.shared.
	 */
	private _ticker: Ticker;

	protected back: Container;
	protected bar: Container;


	constructor(back: Container, bar: Container, ticker?: Ticker) {

		super();

		this._ticker = ticker ?? Ticker.shared;

		this.back = back;
		this.bar = bar;

		bar.x = back.x + 2;
		bar.y = (back.height - bar.height) / 2;

		this.addChild(back);
		this.addChild(bar);

		this._loading = false;
		this._complete = false;

	}

	updateProgress(delta: number) {

		if (!this._loader) this.stop();
		else if (this._loader.progress === 1) {

			this._complete = true;
			this._loading = false;

		} else {

			this.bar.scale.x += (this._loader.progress - this.bar.scale.x) / 8;

		}

	}

	watch(loader: Loader) {

		this._loader = loader;
		this.bar.scale.x = loader.progress;
		this._loading = true;
		this._complete = false;

		Ticker.shared.add(this.updateProgress, this);

	}

	complete() {

		Ticker.shared.remove(this.updateProgress, this);
		this._complete = true;
		this._loading = false;

	}

	stop() {

		Ticker.shared.remove(this.updateProgress, this);
		this._loading = false;
		this._complete = false;
		this._loader = undefined;

	}

}