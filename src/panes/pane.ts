import { Layout } from '@/layout/layout';
import { Container, DisplayObject, Sprite, NineSlicePlane, InteractionEvent } from 'pixi.js';
import { UiSkin } from '../ui-skin';
import { Tween } from '@tweenjs/tween.js';
import { makeShowTween, makeHidetween } from '../utils/tween-utils';
import { DefaultSkin } from '../defaults';

export type PaneOptions = {

	skin?: UiSkin,

	/**
	 * Whether to automatically create tweens that play when tween is hidden or shown.
	 * Default is false.
	 */
	makeTweens?: boolean,

	width?: number,
	height?: number,

	bg?: Container | NineSlicePlane
};

export class Pane extends Container {

	get showTween() { return this._showTween; }
	set showTween(v) { this._showTween = v; }

	get hideTween() { return this._hideTween; }
	set hideTween(v) { this._hideTween = v; }

	/**
	 * {number}
	 */
	get padding() { return this._padding; }
	set padding(v) { this._padding = v; }


	setWidth(v: number): void {
		this.width = v;
		if (this._bg) this._bg.width = v;
	}

	setHeight(v: number): void {
		this.height = v;
		if (this._bg) this._bg.height = v;
	}

	/**
	 * Pane background that fills the pane behind all other elements.
	 */
	get bg(): Container | NineSlicePlane | undefined { return this._bg; }
	set bg(v: Container | NineSlicePlane | undefined) { this._bg = v; }

	get layout() { return this._layout; }
	set layout(v) {
		this._layout = v;
		if (v) v.arrange();
	}

	private _layout?: Layout;
	private _padding: number = 12;
	private _bg?: Container | NineSlicePlane;
	skin?: UiSkin;
	private _showTween?: Tween<Pane>;
	private _hideTween?: Tween<Pane>

	/**
	 *
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 */
	constructor(opts?: PaneOptions) {

		super();

		// placing these variables here allows opts to override.
		this.interactive = this.interactiveChildren = true;

		this.skin = opts?.skin ?? DefaultSkin;

		if (opts?.bg) {
			this._bg = opts.bg;
		} else if (this.skin) {
			this._bg = this.skin.makeFrame(this.width, this.height);
		}
		if (this._bg) {
			this._bg.width = this.width;
			this._bg.height = this.height;
			this.addChild(this._bg);
		}

		if (opts) {

			this.width = opts?.width ?? 100;
			this.height = opts?.height ?? 100;

			if (opts.makeTweens) {
				this.showTween = makeShowTween(this);
				this.hideTween = makeHidetween(this);
			}

		}

		this.on('pointerdown', (e: InteractionEvent) => e.stopPropagation());

	}

	/**
	 * Add content vertically from last child.
	 * @param {DisplayObject} clip
	 * @param {number} [padX=0]
	 * @param {number} [padY=0]
	 * @param {Container} [parent=null]
	 */
	addContentY(clip: DisplayObject, padX: number = 0, padY: number = 0, parent?: Container) {

		let lastY = padY;

		if (clip instanceof Sprite) {
			lastY += clip.anchor.y * clip.height;
		}
		if (!parent) parent = this;

		if (parent.children.length > 0) {

			let last = parent.children[parent.children.length - 1];
			if (last instanceof Sprite) {
				lastY += last.y + (1 - last.anchor.y) * last.height;
			} else {
				lastY += last.y + last.getBounds().height;
			}

		}

		clip.position.set(padX, lastY);

		parent.addChild(clip);

	}

	/**
	 * Arrange items in pane using the pane's layout object.
	 */
	arrange(): void {
		if (this._layout) this._layout.arrange();
	}

	/**
	 * Toggle visibility.
	 */
	toggle(): void {

		if (this.visible && !this.hideTween?.isPlaying()) {

			this._showTween?.stop();
			if (this.hideTween) {
				this.hideTween.start();
			} else {
				this.visible = true;
			}
		} else {

			this.hideTween?.stop();
			if (this.showTween) {
				this.showTween.start();
			} else {
				this.visible = false;
			}
		}

	}

	/**
	 * Ensure the clip is padded from the pane edge's by
	 * the padding amount.
	 * @param {DisplayObject} clip
	 */
	pad(clip: DisplayObject) {

		const bounds = clip.getBounds();

		if (clip.x < this._padding) clip.x = this._padding;
		else if (clip.x + bounds.width > this.width) clip.x = this.width - bounds.width - this._padding;

		if (clip.y < this._padding) clip.y = this._padding;
		else if (clip.y + bounds.height > this.height) clip.y = this.height - bounds.height - this._padding;

	}

	/**
	 * Center a clip's width within this pane.
	 */
	centerX(clip: DisplayObject) {
		clip.x = 0.5 * (this.width - clip.getBounds().width);
	}

	/**
	 * Center a clip's height within this pane.
	 */
	centerY(clip: DisplayObject) {
		clip.y = 0.5 * (this.height - clip.getBounds().height);
	}

	/**
	 * Center a clip in the view.
	 * @param {DisplayObject} clip
	 */
	center(clip: DisplayObject, pctX: number = 0.5, pctY: number = 0.5) {

		const bnds = clip.getBounds();
		clip.x = pctX * (this.width - bnds.width);
		clip.y = pctY * (this.height - bnds.height);

	}

	show(): void {
		this.interactive = true;
		this.visible = true;
	}

	hide(): void {
		this.interactive = false;
		this.visible = false;
	}

}