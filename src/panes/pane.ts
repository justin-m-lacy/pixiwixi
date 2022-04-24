import Layout from '@/layout/layout';
import { Container, DisplayObject, Sprite, NineSlicePlane, InteractionEvent } from 'pixi.js';
import UiSkin from '../ui-skin';

export type PaneOptions = { skin?: UiSkin };

export default class Pane extends Container {

	get tween() { return this._tween; }
	set tween(v) { this._tween = v; }

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
		this._height = v;
		if (this._bg) this._bg.height = v;
	}

	/**
	 * {DisplayObject}
	 */
	get bg(): Container | NineSlicePlane | undefined { return this._bg; }
	set bg(v: Container | NineSlicePlane | undefined) { this._bg = v; }

	get layout() { return this._layout; }
	set layout(v) {
		this._layout = v;
		if (v) v.arrange();
	}

	_layout?: Layout;
	_padding: number = 12;
	_visible: boolean = true;
	_width: number = 0;
	_height: number = 0;
	_bg?: Container | NineSlicePlane;
	_showing: boolean = false;
	skin?: UiSkin;
	_tween?: any;

	/**
	 *
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 */
	constructor(opts?: PaneOptions) {

		super();


		// placing these variables here allows opts to override.
		this.interactive = this.interactiveChildren = true;

		if (opts) {

			Object.assign(this, opts);
			this.skin = opts.skin;

		}

		if (!this._width) this._width = super.width;
		if (!this._height) this._height = super.height;

		if (this._bg != null && this.skin) {
			this._bg = this.skin.makePane(this._width, this._height);
			if (this._bg) {
				this.addChild(this._bg);
			}
		}

		this.on('pointerdown', (e: InteractionEvent) => e.stopPropagation());

		this._showing = false;

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

		if (this._tween) {

			if (this._showing === true) {
				this._tween.reverse();
			} else {
				this._tween.play();
			}
			this._showing = !this._showing;

		} else this.visible = !this.visible;

	}

	/**
	 * Ensure the clip is padded from the pane edge's by
	 * the padding amount.
	 * @param {DisplayObject} clip
	 */
	pad(clip: DisplayObject) {

		const bounds = clip.getBounds();

		if (clip.x < this._padding) clip.x = this._padding;
		else if (clip.x + bounds.width > this._width) clip.x = this._width - bounds.width - this._padding;

		if (clip.y < this._padding) clip.y = this._padding;
		else if (clip.y + bounds.height > this._height) clip.y = this._height - bounds.height - this._padding;

	}

	centerX(clip: DisplayObject) {
		clip.x = 0.5 * (this._width - clip.getBounds().width);
	}

	centerY(clip: DisplayObject) {
		clip.y = 0.5 * (this._height - clip.getBounds().height);
	}

	/**
	 * Center a clip in the view.
	 * @param {DisplayObject} clip
	 */
	center(clip: DisplayObject, pctX: number = 0.5, pctY: number = 0.5) {

		const bnds = clip.getBounds();
		clip.x = pctX * (this._width - bnds.width);
		clip.y = pctY * (this._height - bnds.height);

	}

	show(): void {
		this._showing = true;
		this.interactive = true;
		this.visible = true;

	}

	hide(): void {
		this._showing = false;
		this.interactive = false;
		this.visible = false;
	}

}