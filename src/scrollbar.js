import { Container, Sprite, Point } from "pixi.js";
import * as PIXI from 'pixi.js';
import Pane from "./pane";
import UiSkin from "./uiSkin";

export const ScrollAxis = {
	VERTICAL:1,
	HORIZONTAL:2
};

export default class Scrollbar extends Pane {

	/**
	 * {number} [direction=ScrollAxis.VERTICAL] - The direction of the scrollbar,
	 * vertical or horizontal.
	 */
	get axis() { return this._axis; }
	set axis(v) {

		this._axis = v;
		if ( v === ScrollAxis.HORIZONTAL ) {

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
		if ( this._axis === ScrollAxis.HORIZONTAL ) this._thumb.width = v;
		else this._thumb.height = v;

	}

	/**
	 * {number}
	 */
	get height() { return this._height; }
	set height(v) {

		// test against !horizontal in case the axis hasnt been set yet,
		// though it probably doesn't matter.
		if ( this._axis !== ScrollAxis.HORIZONTAL ) {
			this._axisLength = v;
		}

		super.height = v;

	}

	/**
	 * {number}
	 */
	get width() { return this._width; }
	set width(v) { this._width =v;
	
		if ( this._axis === ScrollAxis.HORIZONTAL ) {
			this._axisLength = v;
		}
		super.width = v;

	}

	/**
	 * {boolean} whether the scrollbar will automatically hide when the view
	 * area is larger than the scrollable area.
	 */
	get autoHide() { return this._autoHide; }
	set autoHide(v) { this._autoHide=v;}


	/**
	 * {boolean} [autoSizeThumb] - true if thumb should resize to match
	 * the scrollable size. true by default.
	 */
	get autoSizeThumb() { return this._autoSizeThumb; }
	set autoSizeThumb(v) { this._autoSizeThumb=v;}

	/**
	 * {DisplayObject} clip being scrolled.
	 */
	get target() { return this._target; }
	set target(v) {

		if ( this._target ) {
			this._target.removeListener( 'wheel', this.wheelEvent, this );
		}

		this._target=v;

		if ( v ) {

			if ( v.mask ) {

				if ( this._axis === ScrollAxis.HORIZONTAL ) {
					this._pageSize = v.mask.width;
				} else {
					this._pageSize = v.mask.height;
				}

			}
			if ( this._autoSizeThumb === true ) this.setThumbSize();

			v.on('wheel', this.wheelEvent, this );

		}

	}

	/**
	 * {string} - If a scroll target is set, the property being scrolled on the target,
	 * e.g. 'x', or 'y'
	 */
	get scrollProp() { return this._scrollProp; }
	set scrollProp(v) { this._scrollProp = v; }

	/**
	 * {string} The property of the target giving the maximum scrollable area. e.g. 'width' or 'height'
	 */
	get sizeProp() { return this._sizeProp; }
	set sizeProp(v) { this._sizeProp = v;}

	//get minProp() { return this._minProp; }
	//set minProp(v) { this._minProp = v;}

	/**
	 * {string} - If a scroll target is set, the property of the target that determines
	 * the maximum scroll value.
	 */
	//get maxProp() { return this._maxProp; }
	//set maxProp(v) { this._maxProp = v;}

	
	/**
	 * {number} [scrollMin=0] Minimum scroll value.
	 */
	//get scrollMin() { return this._scrollMin; }
	//set scrollMin(v) { this._scrollMin =v;}

	/**
	 * {number} [scrollMax=0] Maximum scroll value.
	 */
	//get scrollMax() { return this._scrollMax; }
	//set scrollMax(v) { this._scrollMax=v;}

	/**
	 * 
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 * @param {UISkin} opts.skin
	 */
	constructor( app, opts=null ){

		super( app, opts );

		if ( this._autoSizeThumb !== false ) this._autoSizeThumb = true;

		this.axis = this._axis || ScrollAxis.VERTICAL;
		
		if ( this._axis === ScrollAxis.HORIZONTAL ) {

			if ( this._target && this._target.mask ) this.width = this._target.mask.width;
			this.height = opts.height || this.skin.scrollbarWidth || 18;
			this._axisLength = this.width;

		} else {

			if ( this._target && this._target.mask ) this.height = this._target.mask.height;
			this.width = opts.width || this.skin.scrollbarWidth || 18;
			this._axisLength = this.height;

		}
		this._pageSize = this._pageSize || this._axisLength || 240;

		this.makeThumb();
		this.refresh();

		//console.log('axisprop: ' + this._axisProp);
		//console.log('axislen: ' + this._axisLength);
		//console.log('axis: ' + this._axis );
		//console.log('height: ' + this.height );

		this.bg.interactive = true;
		this.bg.on( 'pointerdown', this.barClick, this );

		this.interactive = this.interactiveChildren = true;

		this._dragOffset = 0;
		this._dragPt = new Point();
		this._dragging = false;

		this.on( 'wheel', this.wheelEvent, this );

	}

	/**
	 * Scroll with mouse wheel.
	 * @param {} evt 
	 */
	wheelEvent( evt ) {

		this._thumb[this._axisProp] += evt.data.deltaY;
		this.scroll();

	}

	/**
	 * Refresh scrollbar and thumb size.
	 */
	refresh() {

		if ( this._autoSizeThumb === true ) this.setThumbSize();
		if ( !this._target || this._target.visible === false ) {
			console.log('Hiding scrollbar: ' + (this._target ? 'target hidden' : 'no target'));
			this._visible =false;
			return;
		}

		// size of scrollable area.
		var scrollSize = this._target[this._sizeProp];

		if ( scrollSize === undefined || scrollSize === null ) {
			this.visible = false;
			return;
		}
		if ( this._autoHide && scrollSize <= this._pageSize ) {
			console.log('autohiding scroll bar ');
			this.visible = false;
			return;
		}

		var curScroll = this._target[this._scrollProp];

		this.visible = true;
		if ( curScroll > 0 ) this._target[this._scrollProp] = 0;
		else if ( curScroll + scrollSize < this._pageSize ) this._target[this._scrollProp] = this._pageSize - scrollSize;

		this.positionThumb();


	}


	/**
	 * Scroll content to the thumb's current location.
	 */
	scroll() {

		// thumb-y.
		let thumbVal = this.thumb[this._axisProp];
		let thumbSize = this.thumbSize;

		if ( thumbVal < 0 ) this.thumb[this._axisProp] = thumbVal = 0;
		else if ( thumbVal > (this._pageSize - thumbSize ) ) this.thumb[this._axisProp] = thumbVal = this._pageSize - thumbSize;

		if ( !this.target || this._pageSize === thumbSize ) return;

		this._target.y = ( thumbVal /( this._pageSize - thumbSize) )*(this._pageSize - this._target.height );

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
		if ( scroll < (-this._target[this._sizeProp] + this._pageSize ) ) scroll = -this._target[this._sizeProp] + this._pageSize;

		this._target[this._scrollProp] = scroll;

		this.positionThumb();

	}

	/**
	 * Set thumb position to correct location based on target position.
	 */
	positionThumb() {
		this.thumb[this._axisProp] =
			this._target[this._scrollProp] * (this._pageSize - this.thumbSize ) / ( this._pageSize - this._target[this._sizeProp] )
	}

	/**
	 * Bar area not on thumb was clicked.
	 * @param {InteractionEvent} evt 
	 */
	barClick( evt ) {

		evt.data.getLocalPosition( this, this._dragPt );

		let dragVal = this._dragPt[this._axisProp];
		let thumbVal = this._thumb[this._axisProp];

		if ( dragVal < thumbVal ) {
			this.pageUp();
		} else if ( dragVal > thumbVal + this.thumbSize ) {
			this.pageDown();
		}


	}

	/**
	 * Create the scrollbar thumb.
	 */
	makeThumb() {

		console.assert( this.skin != null, 'scrollbar.js: this.skin: ' + this.skin );
		console.assert( this.skin.box != null, 'scrollbar.js: this.skin.box: ' + this.skin.box);

		let thumb = this._thumb = this.skin.makePane();
		thumb.name = "thumb";

		if ( this._axis === ScrollAxis.HORIZONTAL ) {

			thumb.height = this.height;
			thumb.y = ( this.height - thumb.height)/2;

		} else {

			thumb.width = this.width;
			thumb.x = ( this.width - thumb.width)/2;
	
		}
	
		thumb.on('pointerdown', this.startDrag, this );
		thumb.on('pointerup', this.endDrag, this );
		thumb.on('pointerupoutside', this.endDrag, this );

		this.addChild( thumb );

		thumb.interactive = true;

		return thumb;

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	startDrag(evt) {

		this._dragging = true;
		evt.data.getLocalPosition( this, this._dragPt );

		this._dragOffset = this._dragPt[this._axisProp] - this._thumb[this._axisProp];

		this.thumb.on( 'pointermove', this.onDrag, this );

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	onDrag(evt) {

		if ( this._dragging !== true ) return;

		evt.data.getLocalPosition( this, this._dragPt );

		this._thumb[this._axisProp] = this._dragPt[this._axisProp] - this._dragOffset;;

		this.scroll();

	}

	/**
	 * 
	 * @param {*} evt 
	 */
	endDrag(evt) {

		this.thumb.on( 'pointermove', this.onDrag, this );
		this._dragging = false;
	}

	/**
	 * Current scroll prop value of target.
	 */
	getTargetValue() {
		return ( this._target && this._scrollProp ) ? this._target[this._scrollProp] : 0;
	}
	setTargetValue(v) {
		if ( this._target && this._scrollProp ) this._target[this._scrollProp] = v;
	}

	setThumbSize() {

		if ( this.target && this.target[this._sizeProp] ) {

			this.thumbSize =  this._axisLength*( this._pageSize / this.target[this._sizeProp] );

		} else this.thumbSize = this._axisLength;

	}

	/*getTargetMax() {
		return ( this._target && this._maxProp ) ? this._target[this._maxProp] : 0;
	}

	setTargetMax(v) {
		if ( this._target && this._maxProp ) this._target[this._maxProp] = v;
	}*/

}