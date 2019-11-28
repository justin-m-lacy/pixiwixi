import { Container, DisplayObject } from "pixi.js";

export default class Pane extends Container {

	/**
	 * {TweenMax} Tween to hide or show the pane.
	 */
	get tween() { return this._tween; }
	set tween(v) { this._tween = v; }

	/**
	 * {number}
	 */
	get padding() { return this._padding; }
	set padding(v) { this._padding = v;}

	/**
	 * {number}
	 */
	get width() { return this._width;}
	set width(v) { this._width = v;
		if ( this._bg ) this._bg.width = v; }

	/**
	 * {number}
	 */
	get height() { return this._height; }
	set height(v) {
		this._height = v;
		if ( this._bg ) this._bg.height = v;
	}

	/**
	 * {DisplayObject}
	 */
	get bg() { return this._bg; }
	set bg(v) { this._bg = v; }

	get layout() { return this._layout; }
	set layout(v) {
		this._layout = v;
		if ( v ) v.arrange( this );
	}

	/**
	 *
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 */
	constructor( app, opts=null ) {

		super();

		this.app = app;

		// placing these variables here allows opts to override.
		this.interactive = this.interactiveChildren = true;
		this._visible = true;
		this._padding = 12;

		if ( opts ) {

			Object.assign( this, opts );
			this.skin = opts.skin;

		}

		if ( !this._width ) this._width = super.width;
		if (!this._height ) this._height = super.height;

		if ( this.bg !== false && this.skin ) {
			this._bg = this.skin.makePane( this._width, this._height );
			this.addChild( this._bg );
		}

		//this.on( 'pointerup', (e)=>e.stopPropagation() );
		this.on( 'pointerdown', (e)=>e.stopPropagation() );

		this._showing = false;

	}

	/**
	 * Add content vertically from last child.
	 * @param {DisplayObject} clip
	 * @param {number} [padX=0]
	 * @param {number} [padY=0]
	 * @param {Container} [parent=null]
	 */
	addContentY( clip, padX=0, padY=0, parent=null ) {

		var lastY = padY;

		if ( clip.anchor ) lastY += clip.anchor.y*clip.height;

		if ( !parent ) parent = this;

		if ( parent.children.length > 0 ) {

			let last = parent.children[ parent.children.length-1 ];
			if ( last.anchor ) lastY += last.y + (1 - last.anchor.y)*last.height;
			else lastY += last.y + last.height;

		}

		clip.position.set( padX, lastY );

		parent.addChild( clip );

	}

	/**
	 * Arrange items in pane using the pane's layout object.
	 */
	arrange() {
		if ( this._layout ) this._layout.arrange(this);
	}

	toggle() {

		if ( this._tween ) {

			if ( this._showing === true ) {
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
	pad( clip ) {

		if ( clip.x < this._padding ) clip.x = this._padding;
		else if ( clip.x+clip.width > this._width ) clip.x = this._width - clip.width - this._padding;

		if ( clip.y < this._padding ) clip.y = this._padding;
		else if ( clip.y+clip.height > this._height ) clip.y = this._height - clip.height - this._padding;

	}

	centerX( clip ) {
		clip.x = 0.5*(this._width - clip.width );
	}

	centerY(clip){
		clip.y = 0.5*(this._width-clip.width );
	}

	/**
	 * Center a clip in the view.
	 * @param {DisplayObject} clip
	 */
	center( clip, pctX=0.5, pctY=0.5 ) {

		clip.x = pctX*(this._width - clip.width );
		clip.y = pctY*(this._height - clip.height );

	}

	show() {
		this._showing = true;
		this.interactive = true;
		this.visible = true;

	}

	hide(){
		this._showing = false;
		this.interactive = false;
		this.visible = false;
	}

}