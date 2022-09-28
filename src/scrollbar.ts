import { Point, DisplayObject, InteractionEvent, Container } from 'pixi.js';
import { Pane } from "./panes/pane";
import { PaneOptions } from './panes/pane';
import { getMaskWidth, getMaskHeight } from './utils/layout-utils';

export enum ScrollAxis {
	VERTICAL = 1,
	HORIZONTAL
};

export type ScrollbarOpts = PaneOptions & {
	target?: DisplayObject,
	autoSizethumb?: boolean,
	axis?: ScrollAxis,
	axisLength?: number,
	pageSize?: number,
	height?: number,
	width?: number
};
export class Scrollbar extends Pane {

	/**
	 * {number} [direction=ScrollAxis.VERTICAL] - The direction of the scrollbar,
	 * vertical or horizontal.
	 */
	get axis() { return this._axis; }
	set axis(v: ScrollAxis) {
		this._updateAxis(v);

	}

	/**
	 * {number} - Size of the viewable region.
	 */
	get pageSize() { return this._pageSize; }
	set pageSize(v) {

		this._pageSize = v;
		this.refresh();

	}

	/**
	 * {Container}
	 */
	get thumb() { return this._thumb; }
	set thumb(v) { this._thumb = v; }

	/**
	 * {number} sets the size of the thumb in the scrolling direction.
	 * If no value is specified, the thumb will change size based
	 * on the ratio of pageSize to totalSize.
	 */
	get thumbSize(): number { return this._thumbSize; }
	set thumbSize(v: number) {

		this._thumbSize = v;
		if (this._axis === ScrollAxis.HORIZONTAL) {
			this._thumb.width = v;
		}
		else {
			this._thumb.height = v;
		}

	}

	setHeight(v: number) {

		// test against !horizontal in case the axis hasnt been set yet,
		// though it probably doesn't matter.
		if (this._axis !== ScrollAxis.HORIZONTAL) {
			this._axisLength = v;
		}

		super.height = v;

	}

	setWidth(v: number) {
		this._width = v;

		if (this._axis === ScrollAxis.HORIZONTAL) {
			this._axisLength = v;
		}
		super.width = v;

	}

	/**
	 * {boolean} whether the scrollbar will automatically hide when the view
	 * area is larger than the scrollable area.
	 */
	get autoHide() { return this._autoHide; }
	set autoHide(v) { this._autoHide = v; }


	/**
	 * {boolean} [autoSizeThumb] - true if thumb should resize to match
	 * the scrollable size. true by default.
	 */
	get autoSizeThumb() { return this._autoSizeThumb; }
	set autoSizeThumb(v) { this._autoSizeThumb = v; }

	get target() { return this._target; }
	set target(v) {

		if (this._target) {
			this._target.removeListener('wheel', this.wheelEvent, this);
		}

		this._target = v;

		if (v) {

			if (v.mask) {

				if (this._axis === ScrollAxis.HORIZONTAL) {
					this._pageSize = getMaskWidth(v.mask);
				} else {
					this._pageSize = getMaskHeight(v.mask);
				}

			}
			if (this._autoSizeThumb === true) this.setThumbSize();

			v.on('wheel', this.wheelEvent, this);

		}

	}

	/**
	 * {string} - The property being scrolled on the scroll target,
	 * e.g. 'x', or 'y'
	 */
	get scrollProp() { return this._scrollProp; }
	set scrollProp(v) { this._scrollProp = v; }

	/**
	 * {string} The property of the target that defines the maximum scrollable area.
	 * e.g. 'width' or 'height'
	 */
	get sizeProp() { return this._sizeProp; }
	set sizeProp(v) { this._sizeProp = v; }

	_sizeProp: 'width' | 'height' = 'width';
	_scrollProp: 'x' | 'y' = 'x';
	_axisProp: 'x' | 'y' = 'x';

	/**
	 * Container being scrolled.
	 */
	_target?: Container;

	_autoSizeThumb: boolean = true;
	_autoHide: boolean = false;
	_thumbSize: number = 32;
	_pageSize: number;

	/**
	 * Length of the scrollbar's axis.
	 */
	_axisLength: number;

	_axis: ScrollAxis;
	_thumb: Container;

	_dragOffset: number = 0;
	_dragPt: Point = new Point();
	_dragging: boolean = false;

	constructor(
		opts?: ScrollbarOpts
	) {

		super(opts);

		if (this._autoSizeThumb !== false) this._autoSizeThumb = true;

		this._axis = opts?.axis ?? ScrollAxis.VERTICAL;
		this._updateAxis(this._axis);

		if (this._axis === ScrollAxis.HORIZONTAL) {

			if (this._target && this._target.mask) {
				this.width = getMaskWidth(this._target.mask);
			}
			this._axisLength = this.width;
			this.height = opts?.height ?? opts?.skin?.scrollbarWidth ?? 18;

		} else {

			if (this._target && this._target.mask) {
				this.height = getMaskHeight(this._target.mask);
			}
			this._axisLength = this.height;
			this.width = opts?.width ?? opts?.skin?.scrollbarWidth ?? 18;

		}
		this._pageSize = opts?.pageSize ?? this._axisLength ?? 240;

		this._thumb = this.makeThumb();
		this.refresh();


		if (this.bg) {
			this.bg.interactive = true;
			this.bg.on('pointerdown', this.barClick, this);
		}

		this.interactive = this.interactiveChildren = true;

		this.on('wheel', this.wheelEvent, this);

	}

	/**
	 * Update scroll axis
	 */
	_updateAxis(axis: ScrollAxis) {

		if (axis === ScrollAxis.HORIZONTAL) {

			this._axisProp = 'x';
			this._sizeProp = 'width';
			this._scrollProp = 'x';

		} else {

			this._axisProp = 'y';
			this._sizeProp = 'height';
			this._scrollProp = 'y';

		}

	}

	/**
	 * Scroll with mouse wheel.
	 * @param {} evt 
	 */
	protected wheelEvent(evt: WheelEvent) {

		this._thumb[this._axisProp] += evt.deltaY;
		this.scroll();

	}

	/**
	 * Refresh scrollbar and thumb size.
	 */
	refresh() {

		if (this._autoSizeThumb === true) this.setThumbSize();
		if (!this._target || this._target.visible === false) {
			console.log('Hiding scrollbar: ' + (this._target ? 'target hidden' : 'no target'));
			this.visible = false;
			return;
		} else {

			// size of scrollable area.
			const scrollSize = this._target[this._sizeProp];

			if (scrollSize === undefined || scrollSize === null) {
				this.visible = false;
				return;
			}
			if (this._autoHide && scrollSize <= this._pageSize) {
				this.visible = false;
				return;
			}

			const curScroll = this._target[this._scrollProp];

			this.visible = true;
			if (curScroll > 0) this._target[this._scrollProp] = 0;
			else if (curScroll + scrollSize < this._pageSize) this._target[this._scrollProp] = this._pageSize - scrollSize;

			this.positionThumb();

		}


	}


	/**
	 * Scroll content to the thumb's current location.
	 */
	scroll() {

		// thumb-y.
		let thumbVal = this.thumb[this._axisProp];
		let thumbSize = this.thumbSize;

		if (thumbVal < 0) this.thumb[this._axisProp] = thumbVal = 0;
		else if (thumbVal > (this._pageSize - thumbSize)) this.thumb[this._axisProp] = thumbVal = this._pageSize - thumbSize;

		if (!this._target || this._pageSize === thumbSize) return;

		this._target.y = (thumbVal / (this._pageSize - thumbSize)) * (this._pageSize - this._target.height);

	}

	/**
	 * Scroll up a page. This moves the target view down.
	 */
	pageUp() {

		if (this._target) {

			let scroll = this._target[this._scrollProp] + this._pageSize;
			this._target[this._scrollProp] = scroll < 0 ? 0 : scroll;

			this.positionThumb();
		}

	}

	/**
	 * Scroll down a page. This moves the target view up.
	 */
	pageDown() {

		if (this._target) {
			let scroll = this._target[this._scrollProp] - this._pageSize;
			if (scroll < (-this._target[this._sizeProp] + this._pageSize)) scroll = -this._target[this._sizeProp] + this._pageSize;

			this._target[this._scrollProp] = scroll;

			this.positionThumb();
		}

	}

	/**
	 * Set thumb position to correct location based on target position.
	 */
	protected positionThumb() {
		if (this._target != null) {
			this.thumb[this._axisProp] =
				this._target[this._scrollProp] * (this._pageSize - this.thumbSize) / (this._pageSize - this._target[this._sizeProp])
		} else {
			this.thumb[this._axisProp] = 0;
		}
	}

	protected barClick(evt: InteractionEvent) {

		evt.data.getLocalPosition(this, this._dragPt);

		let dragVal = this._dragPt[this._axisProp];
		let thumbVal = this._thumb[this._axisProp];

		if (dragVal < thumbVal) {
			this.pageUp();
		} else if (dragVal > thumbVal + this.thumbSize) {
			this.pageDown();
		}


	}

	/**
	 * Create the scrollbar thumb.
	 */
	protected makeThumb() {

		console.assert(this.skin != null, 'scrollbar.js: this.skin: ' + this.skin);
		console.assert(this.skin!.box != null, 'scrollbar.js: this.skin.box: ' + this.skin!.box);

		const thumb = this.skin!.makePane() ?? new Container();
		thumb.name = "thumb";

		if (this._axis === ScrollAxis.HORIZONTAL) {

			thumb.height = this._thumbSize;
			thumb.y = (this.height - thumb.height) / 2;

		} else {

			thumb.width = this._thumbSize;
			thumb.x = (this.width - thumb.width) / 2;

		}

		thumb.on('pointerdown', this.startDrag, this);
		thumb.on('pointerup', this.endDrag, this);
		thumb.on('pointerupoutside', this.endDrag, this);

		this.addChild(thumb);

		thumb.interactive = true;

		return thumb;

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	protected startDrag(evt: InteractionEvent) {

		this._dragging = true;
		evt.data.getLocalPosition(this, this._dragPt);

		this._dragOffset = this._dragPt[this._axisProp] - this._thumb[this._axisProp];

		this.thumb.on('pointermove', this.onDrag, this);

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	protected onDrag(evt: InteractionEvent) {

		if (this._dragging !== true) return;

		evt.data.getLocalPosition(this, this._dragPt);

		this._thumb[this._axisProp] = this._dragPt[this._axisProp] - this._dragOffset;;

		this.scroll();

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	protected endDrag(evt: InteractionEvent) {

		this.thumb.on('pointermove', this.onDrag, this);
		this._dragging = false;
	}

	/**
	 * Current scroll prop value of target.
	 */
	getTargetValue() {
		return (this._target) ? this._target[this._scrollProp] : 0;
	}
	setTargetValue(v: number) {
		if (this._target) this._target[this._scrollProp] = v;
	}

	setThumbSize() {

		if (this.target && this.target[this._sizeProp]) {

			this.thumbSize = this._axisLength * (this._pageSize / this.target[this._sizeProp]);

		} else this.thumbSize = this._axisLength;

	}

}