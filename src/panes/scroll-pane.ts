import { Pane } from './pane.js';
import { Container, Graphics, DisplayObject } from 'pixi.js';
import { ScrollAxis } from '../scrollbar';
import { Scrollbar } from '../scrollbar';
import { PaneOptions } from './pane';

export type ScrollPaneOpts = PaneOptions & { axes: ScrollAxis };
/**
 * Pane with a scrollbar and scrollable content area.
 * Scrollable content should be added to the content clip.
 */
export class ScrollPane extends Pane {


	get content(): DisplayObject { return this._content; }

	/**
	 * @property {Scrollbar} Returns the scrollbar, if only one is present, or the vertical
	 * scrollbar, if both are.
	 */
	get scrollbar() { return this._vertical || this._horizontal; }

	/**
	 * @property {Scrollbar} Gets the horizontal scrollbar, if any.
	 */
	get horizontal() { return this._horizontal; }

	/**
	 * @property {Scrollbar} Gets the vertical scrollbar, if any.
	 */
	get vertical() { return this._vertical; }

	/**
	 * @property {number} [axes=ScrollAxis.VERTICAL] The axes for which scrollbars are enabled.
	 * Readonly. To change the scrollbars, use setScrollbars()
	 */
	get axes() { return this._axes; }

	setWidth(v: number) {

		super.width = v;
		if (this._content) {

			const mask = this._content.mask;
			if (mask instanceof Container) {
				mask.width = v;
			}
			const bar = this.scrollbar;
			if (bar) {
				bar.width = v;
				bar.x = v - bar.width - 4;
			}
		}

	}

	setHeight(v: number) {

		super.height = v;
		if (this._content) {
			const mask = this._content.mask;
			if (mask instanceof Container) {
				mask.height = v;
			}
			const bar = this.scrollbar;
			if (bar) {
				bar.height = v;
			}
		}

	}

	private _content: Container;
	private _axes: ScrollAxis;
	private _vertical?: Scrollbar;
	private _horizontal?: Scrollbar;


	/**
	 * 
	 * @param {PIXI.Application} app 
	 * @param {Object} [opts=null]
	 * @param {UiSkin} opts.skin
	 */
	constructor(opts?: ScrollPaneOpts) {

		super(opts);

		this.width = this.width || 200;
		this.height = this.height || 200;

		this._axes = this.axes || ScrollAxis.VERTICAL;

		this._content = new Container();
		this._content.interactive = this._content.accessibleChildren = true;

		//this._content.width = this.width;
		//this._content.height = this.height;

		super.addChild(this._content);

		this.makeMask();
		this.setScrollbars(this._axes);

	}

	addChildAt<T extends DisplayObject>(clip: T, index: number): T {
		this._content.addChildAt(clip, index);
		this.emit('contentchanged', this);
		this.scrollbar?.refresh();
		return clip;
	}

	removeChild<TChildren extends DisplayObject[]>(...children: TChildren): TChildren[0] {
		this._content.removeChild.apply(this._content, children);
		this.emit('contentchanged', this);
		this.scrollbar?.refresh();
		return children[0];
	}

	addChild<TChildren extends DisplayObject[]>(...children: TChildren): TChildren[0] {
		this._content.addChild.apply(this._content, children);
		this.emit('contentchanged', this);
		this.scrollbar?.refresh();
		return children[0];
	}

	/**
	 * Set the current scrollbars.
	 * @param {number} axes - scrollbars to enable.
	 * bitwise OR of ScrollAxis.VERTICAL and/or ScrollAxis.HORIZONTAL 
	 */
	setScrollbars(axes: ScrollAxis) {

		if ((axes & ScrollAxis.VERTICAL) !== 0) {
			if (!this._vertical) this._makeVertical();
		} else if (this._vertical) {

			this._vertical.destroy();
			this._vertical = undefined;

		}

		if ((axes & ScrollAxis.HORIZONTAL) !== 0) {
			if (!this._horizontal) this._makeHorizontal();
		} else if (this._horizontal) {

			this._horizontal.destroy();
			this._horizontal = undefined;

		}

		this._axes = axes;

	}

	/**
	 * Create the vertical scrollbar.
	 */
	_makeVertical() {

		const sb = new Scrollbar(
			{
				skin: this.skin,
				target: this._content
			});

		this._vertical = sb;
		sb.x = this.width - sb.width - 2;
		sb.y = 0;

		super.addChild(sb);

	}

	/**
	 * Create the horizontal scrollbar.
	 */
	_makeHorizontal() {

		const sb = new Scrollbar(
			{
				skin: this.skin,
				target: this._content
			});

		this._horizontal = sb;
		sb.y = this.height - sb.width - 2;
		sb.x = 0;

		super.addChild(sb);

	}

	/**
	 * Refresh the scrollbar and scroll target.
	 */
	refresh() {
		if (this._vertical) this._vertical.refresh();
		if (this._horizontal) this._horizontal.refresh();
	}

	/**
	 * Create the mask to reveal the scroll area.
	 */
	makeMask() {

		let mask = new Graphics();
		mask.beginFill(0);
		mask.drawRect(0, 0, this.width, this.height);
		mask.endFill();
		mask.cacheAsBitmap = true;
		super.addChild(mask);

		this._content.mask = mask;

	}

	removeContentAt(index: number) {
		let clip = this._content.removeChildAt(index);
		this.emit('contentchanged', this);
		this.scrollbar?.refresh();
		return clip;
	}

	destroy() {

		if (this.content?.mask instanceof Container) {
			this.content.mask?.destroy({ children: true, texture: true, baseTexture: true });
		}
		if (this.content != null) {

			if (this.content instanceof Container) {
				this.content.destroy({
					children: true,
					texture: false,
					baseTexture: false
				});
			} else {
				this.content.destroy();
			}

		}

		if (this._vertical) this._vertical.destroy({
			children: true,
			texture: false,
			baseTexture: false
		});
		if (this._horizontal) this._horizontal.destroy({
			children: true,
			texture: false,
			baseTexture: false
		});

	}

}