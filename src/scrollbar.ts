import { Container, Sprite, Point, Application, DisplayObject, NineSlicePlane, InteractionEvent } from 'pixi.js';
import * as PIXI from 'pixi.js';
import Pane from "./panes/pane";
import UiSkin from "./ui-skin";

export enum ScrollAxis {
	VERTICAL = 1,
	HORIZONTAL
};

export default class Scrollbar extends Pane {

	/**
	 * {number} [direction=ScrollAxis.VERTICAL] - The direction of the scrollbar,
	 * vertical or horizontal.
	 */
	get axis() { return this._axis; }
	set axis(v) {

		this._axis = v;
		if (v === ScrollAxis.HORIZONTAL) {

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
	 * {number} - Size of the viewable region represented by the thumb.
	 */
	get pageSize() { return this._pageSize; }
	set pageSize(v) {

		this._pageSize = v;
		this.refresh();

	}

	/**
	 * {DisplayObject}
	 */
	get thumb() { return this._thumb; }
	set thumb(v) { this._thumb = v; }

	/**
	 * {number} sets the size of the thumb in the scrolling direction.
	 * If no value is specified, the thumb
	 * will change size based on the ratio of pageSize to totalSize.
	 */
	get thumbSize() { return this._thumbSize; }
	set thumbSize(v) {

		this._thumbSize = v;
		if (this._axis === ScrollAxis.HORIZONTAL) this._thumb.width = v;
		else this._thumb.height = v;

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

	/**
	 * {DisplayObject} clip being scrolled.
	 */
	get target() { return this._target; }
	set target(v) {

		if (this._target) {
			this._target.removeListener('wheel', this.wheelEvent, this);
		}

		this._target = v;

		if (v) {

			if (v.mask) {

				if (this._axis === ScrollAxis.HORIZONTAL) {
					this._pageSize = v.mask.width;
				} else {
					this._pageSize = v.mask.height;
				}

			}
			if (this._autoSizeThumb === true) this.setThumbSize();

			v.on('wheel', this.wheelEvent, this);

		}

	}

	/**
	 * {string} - If a scroll target is set, the property being scrolled on the target,
	 * e.g. 'x', or 'y'
	 */
	get scrollProp() { return this._scrollProp; }
	set scrollProp(v) { this._scrollProp = v; }

	/**
	 * {string} The property of the target that defines the maximum scrollable area. e.g. 'width' or 'height'
	 */
	get sizeProp() { return this._sizeProp; }
	set sizeProp(v) { this._sizeProp = v; }

	_sizeProp: 'width' | 'height';
	_scrollProp: 'x' | 'y';
	_axisProp: 'x' | 'y';
	_target?: DisplayObject;
	_autoSizeThumb: boolean = true;
	_autoHide: boolean = false;
	_thumbSize: number;
	_pageSize: number;
	_axisLength: number;
	_axis: ScrollAxis;
	_thumb: DisplayObject | NineSlicePlane;

	_dragOffset: number = 0;
	_dragPt: Point = new Point();
	_dragging: boolean = false;

	/**
	 * 
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 * @param {UISkin} opts.skin
	 */
	constructor(app: Application,
		opts?: { skin?: UiSkin, target?: DisplayObject, autoSizethumb?: boolean, axis?: ScrollAxis, axisLength?: number, pageSize?: number, height?: number, width?: number }) {

		super(app, opts);

		if (this._autoSizeThumb !== false) this._autoSizeThumb = true;

		this._axis = opts?.axis ?? ScrollAxis.VERTICAL;

		if (this._axis === ScrollAxis.HORIZONTAL) {

			if (this._target && this._target.mask) this.width = this._target.mask.width;
			this.height = opts.height || this.skin.scrollbarWidth || 18;
			this._axisLength = this.width;

		} else {

			if (this._target && this._target.mask) this.height = this._target.mask.height;
			this.width = opts.width || this.skin.scrollbarWidth || 18;
			this._axisLength = this.height;

		}
		this._pageSize = opts?.pageSize ?? this._axisLength || 240;

		this.makeThumb();
		this.refresh();

		//console.log('axisprop: ' + this._axisProp);
		//console.log('axislen: ' + this._axisLength);
		//console.log('axis: ' + this._axis );
		//console.log('height: ' + this.height );

		if (this.bg) {
			this.bg.interactive = true;
			this.bg.on('pointerdown', this.barClick, this);
		}

		this.interactive = this.interactiveChildren = true;

		this.on('wheel', this.wheelEvent, this);

	}

	_setScrollAxis() {
	}

	/**
	 * Scroll with mouse wheel.
	 * @param {} evt 
	 */
	wheelEvent(evt: WheelEvent) {

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
			this._visible = false;
			return;
		}

		// size of scrollable area.
		var scrollSize = this._target[this._sizeProp];

		if (scrollSize === undefined || scrollSize === null) {
			this.visible = false;
			return;
		}
		if (this._autoHide && scrollSize <= this._pageSize) {
			console.log('autohiding scroll bar ');
			this.visible = false;
			return;
		}

		var curScroll = this._target[this._scrollProp];

		this.visible = true;
		if (curScroll > 0) this._target[this._scrollProp] = 0;
		else if (curScroll + scrollSize < this._pageSize) this._target[this._scrollProp] = this._pageSize - scrollSize;

		this.positionThumb();


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

		if (!this.target || this._pageSize === thumbSize) return;

		this._target.y = (thumbVal / (this._pageSize - thumbSize)) * (this._pageSize - this._target.height);

	}

	/**
	 * Scroll up a page. This moves the target view down.
	 */
	pageUp() {

		let scroll = this._target[this._scrollProp] + this._pageSize;

		this._target[this._scrollProp] = scroll < 0 ? 0 : scroll;

		this.positionThumb();

	}

	/**
	 * Scroll down a page. This moves the target view up.
	 */
	pageDown() {

		let scroll = this._target[this._scrollProp] - this._pageSize;
		if (scroll < (-this._target[this._sizeProp] + this._pageSize)) scroll = -this._target[this._sizeProp] + this._pageSize;

		this._target[this._scrollProp] = scroll;

		this.positionThumb();

	}

	/**
	 * Set thumb position to correct location based on target position.
	 */
	positionThumb() {
		this.thumb[this._axisProp] =
			this._target[this._scrollProp] * (this._pageSize - this.thumbSize) / (this._pageSize - this._target[this._sizeProp])
	}

	/**
	 * Bar area not on thumb was clicked.
	 * @param {InteractionEvent} evt 
	 */
	barClick(evt) {

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
	makeThumb() {

		console.assert(this.skin != null, 'scrollbar.js: this.skin: ' + this.skin);
		console.assert(this.skin!.box != null, 'scrollbar.js: this.skin.box: ' + this.skin!.box);

		const thumb = this._thumb = this.skin!.makePane() ?? new DisplayObject;
		thumb.name = "thumb";

		if (this._axis === ScrollAxis.HORIZONTAL) {

			thumb.height = this.height;
			thumb.y = (this.height - thumb.height) / 2;

		} else {

			thumb.width = this.width;
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
	startDrag(evt: InteractionEvent) {

		this._dragging = true;
		evt.data.getLocalPosition(this, this._dragPt);

		this._dragOffset = this._dragPt[this._axisProp] - this._thumb[this._axisProp];

		this.thumb.on('pointermove', this.onDrag, this);

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	onDrag(evt: InteractionEvent) {

		if (this._dragging !== true) return;

		evt.data.getLocalPosition(this, this._dragPt);

		this._thumb[this._axisProp] = this._dragPt[this._axisProp] - this._dragOffset;;

		this.scroll();

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	endDrag(evt: InteractionEvent) {

		this.thumb.on('pointermove', this.onDrag, this);
		this._dragging = false;
	}

	/**
	 * Current scroll prop value of target.
	 */
	getTargetValue() {
		return (this._target && this._scrollProp) ? this._target[this._scrollProp] : 0;
	}
	setTargetValue(v: number) {
		if (this._target && this._scrollProp) this._target[this._scrollProp] = v;
	}

	setThumbSize() {

		if (this.target && this.target[this._sizeProp]) {

			this.thumbSize = this._axisLength * (this._pageSize / this.target[this._sizeProp]);

		} else this.thumbSize = this._axisLength;

	}

}