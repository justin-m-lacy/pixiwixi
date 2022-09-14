import { Container } from 'pixi.js';
import * as PIXI from 'pixi.js';

export class ProgressBar extends Container {

	get loader(): PIXI.Loader | undefined { return this._loader; }

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

	_loader?: PIXI.Loader;
	_loading: boolean = false;
	_complete: boolean = false;
	protected back: Container;
	protected bar: Container;


	constructor(back: Container, bar: Container) {

		super();

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

	watch(loader: PIXI.Loader) {

		this._loader = loader;
		this.bar.scale.x = loader.progress;
		this._loading = true;
		this._complete = false;

		PIXI.Ticker.shared.add(this.updateProgress, this);

	}

	complete() {

		PIXI.Ticker.shared.remove(this.updateProgress, this);
		this._complete = true;
		this._loading = false;

	}

	stop() {

		PIXI.Ticker.shared.remove(this.updateProgress, this);
		this._loading = false;
		this._complete = false;
		this._loader = undefined;

	}

}