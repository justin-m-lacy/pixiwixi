import Pane from './pane.js';
import { Container, Graphics } from 'pixi.js';
import Scrollbar from './scrollbar.js';
import {ScrollAxis} from './scrollbar';
import { Anchors, UiSkin } from '../index';

/**
 * Pane with a scrollbar and scrollable content area.
 * Scrollable content should be added to the content clip.
 */
export default class ScrollPane extends Pane {

	/**
	 * @property {DisplayObject}
	 */
	get content() { return this._content; }

	/**
	 * @property {DisplayObject}
	 */
	get mask() { return this._content.mask; }

	/**
	 * @property {Scrollbar} Returns the scrollbar, if only one is present, or the vertical
	 * scrollbar, if both are.
	 */
	get scrollbar() { return this._vertical || this._horizontal; }

	/**
	 * @property {Scrollbar} Gets the horizontal scrollbar, if any.
	 */
	get horizontal(){ return this._horizontal; }

	/**
	 * @property {Scrollbar} Gets the vertical scrollbar, if any.
	 */
	get vertical() { return this._vertical; }

	/**
	 * @property {number} [axes=ScrollAxis.VERTICAL] The axes for which scrollbars are enabled.
	 * Readonly. To change the scrollbars, use setScrollbars()
	 */
	get axes() { return this._axes; }

	/**
	 * @property {number}
	 */
	get width() { return this._width; }
	set width(v) {

		super.width = v;
		if ( this._content ) {
			this._content.mask.width = v;
			this._scrollbar.x = v - this._scrollbar.width - 4;
		}

	}

	/**
	 * @property {Number}
	 */
	get height(){return this._height;}
	set height(v) {

		super.height = v;
		if ( this._content ) {
			this._content.mask.height = v;
			this._scrollbar.height = v;
		}

	}

	/**
	 * 
	 * @param {PIXI.Application} app 
	 * @param {Object} [opts=null]
	 * @param {UiSkin} opts.skin
	 */
	constructor( app, opts=null ) {

		super( app, opts );

		this.width = this.width || 200;
		this.height = this.height || 200;

		this._axes = this._axes || ScrollAxis.VERTICAL;

		this._content = new Container();
		this._content.interactive = this._content.interactiveChildren = true;
		this._content.width = this.width;
		this._content.height = this.height;

		super.addChild( this._content );

		this.makeMask();
		this.setScrollbars( this._axes );

		// functions defined in constructor so super-classes don't access them
		// before initialization.
		this.addChild = function( clip ) {
	
			this._content.addChild( clip );
			this.emit( 'contentchanged', this );
			this.scrollbar.refresh();
			return clip;
		}

		this.addChildAt = function( clip, index ) {
			this._content.addChildAt( clip, index );
			this.emit( 'contentchanged', this );
			this.scrollbar.refresh();
			return clip;
		}

		this.removeChild = function(child) {
			this._content.removeChild( child );
			this.emit( 'contentchanged', this );
			this.scrollbar.refresh();
			return child;
		}

	}

	/**
	 * Set the current scrollbars.
	 * @param {number} axes - scrollbars to enable.
	 * bitwise OR of ScrollAxis.VERTICAL and/or ScrollAxis.HORIZONTAL 
	 */
	setScrollbars( axes ) {

		if ( (axes & ScrollAxis.VERTICAL ) !== 0 ) {
			if ( !this._vertical ) this._makeVertical();
		} else if ( this._vertical ) {

			this._vertical.destroy();
			this._vertical = null;

		}

		if ( (axes & ScrollAxis.HORIZONTAL ) !== 0 ) {
			if ( !this._horizontal ) this._makeHorizontal();
		} else if ( this._horizontal ) {

			this._horizontal.destroy();
			this._horizontal = null;

		}

		this._scrollbar = this._vertical || this._horizontal;

		this._axes = axes;

	}

	/**
	 * Create the vertical scrollbar.
	 */
	_makeVertical() {

		let sb = new Scrollbar( this.app,
			{
				skin:this.skin,
				target:this._content
			});
	
			this._vertical = sb;
			sb.x = this.width - sb.width - 2;
			sb.y = 0;
	
			super.addChild( sb );

	}

	/**
	 * Create the horizontal scrollbar.
	 */
	_makeHorizontal() {

		let sb = new Scrollbar( this.app,
			{
				skin:this.skin,
				target:this._content
			});
	
			this._horizontal = sb;
			sb.y = this.height - sb.width - 2;
			sb.x = 0;
	
			super.addChild( sb );

	}

	/**
	 * Refresh the scrollbar and scroll target.
	 */
	refresh() {
		if ( this._vertical ) this._vertical.refresh();
		if ( this._horizontal) this._horizontal.refresh();
	}

	/**
	 * Create the mask to reveal the scroll area.
	 */
	makeMask() {

		let mask = new Graphics();
		mask.beginFill( 0 );
		mask.drawRect( 0, 0, this.width, this.height );
		mask.endFill();
		mask.cacheAsBitmap = true;
		super.addChild( mask );

		this._content.mask = mask;

	}

	removeContentAt( index ) {
		let clip = this._content.removeChildAt( index);
		this.emit('contentchanged', this);
		this._scrollbar.refresh();
		return clip;
	}

	destroy() {

		this.content.mask.destroy( 
			true
		);
		this.content.destroy({children:true,
			texture:false,
			baseTexture:false});

		if ( this._vertical ) this._vertical.destroy({
			children:true,
			texture:false,
			baseTexture:false});
		if ( this._horizontal ) this._horizontal.destroy({
			children:true,
			texture:false,
			baseTexture:false});

	}

}