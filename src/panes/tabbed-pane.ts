import { Pane } from './pane';
import { DisplayObject } from 'pixi.js';
import { PaneOptions } from './pane';

/**
 * Tracks multiple subviews which can be displayed in turn.
 */
export class TabbedPane extends Pane {

	get curView() { return this._curView; }
	set curView(v: DisplayObject | undefined) {
		this.showView(v);
		this._curView = v;
	}

	readonly _views: DisplayObject[];
	private _curView?: DisplayObject;
	private _vIndex: number = -1;

	/**
	 * @property {DisplayObject[]} views - subviews.
	 */
	get views() { return this._views; }

	constructor(opts?: PaneOptions & { viewIndex?: number }) {

		super(opts);

		this._views = [];
		this._vIndex = opts?.viewIndex ?? -1;
	}

	/**
	 * Display next view.
	 */
	showNext() {

		let nxt = this._vIndex + 1;
		if (nxt >= this._views.length) return;

		this.showIndex(nxt);

	}

	/**
	 * Display previous view.
	 */
	showPrev() {

		let prev = this._vIndex - 1;
		if (prev < 0 || prev >= this._views.length) return;

		this.showIndex(prev);

	}

	/**
	 * Hide current view and display new view instead.
	 * @param {DisplayObject} v
	 */
	showView(v: DisplayObject | undefined) {
		if (v != null) {
			this.showIndex(this._views.indexOf(v));
		}
	}

	showIndex(ind: number) {

		if (ind < 0 || ind >= this._views.length || ind == this._vIndex) return false;

		if (this._curView) {
			this.removeChild(this._curView);
		}

		let v = this._views[ind];
		if (!v) return false;

		this._vIndex = ind;
		this.addChild(v);
		this._curView = v;
		v.visible = true;

		return true;

	}

	addView(v: DisplayObject) {
		this._views.push(v);
	}

}