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
		this.m_width = v;
		if (this._bg) this._bg.width = v;
	}

	setHeight(v: number): void {
		this.m_height = v;
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
	 * Private width/height is used to disentage background sizing from
	 * parent scaling.
	 */
	private m_width: number;
	private m_height: number;

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

		this.m_width = opts?.width ?? 100;
		this.m_height = opts?.height ?? 100;

		if (opts?.bg) {
			this._bg = opts.bg;
		} else if (this.skin) {
			this._bg = this.skin.makeFrame(this.m_width, this.m_height);
		}
		if (this._bg) {
			this._bg.width = this.m_width;
			this._bg.height = this.m_height;
			this.addChild(this._bg);
		}

		if (opts) {

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
		else if (clip.x + bounds.width > this.m_width) clip.x = this.m_width - bounds.width - this._padding;

		if (clip.y < this._padding) clip.y = this._padding;
		else if (clip.y + bounds.height > this.m_height) clip.y = this.m_height - bounds.height - this._padding;

	}

	/**
	 * Center a clip's width within this pane.
	 */
	centerX(clip: DisplayObject) {
		clip.x = 0.5 * (this.m_width - clip.getBounds().width);
	}

	/**
	 * Center a clip's height within this pane.
	 */
	centerY(clip: DisplayObject) {
		clip.y = 0.5 * (this.m_height - clip.getBounds().height);
	}

	/**
	 * Center a clip in the view.
	 * @param {DisplayObject} clip
	 */
	center(clip: DisplayObject, pctX: number = 0.5, pctY: number = 0.5) {

		const bnds = clip.getBounds();
		clip.x = pctX * (this.m_width - bnds.width);
		clip.y = pctY * (this.m_height - bnds.height);

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