import Pane from '../pane';

/**
 * Tracks multiple subviews which can be displayed in turn.
 */
export default class MultiPane extends Pane {

	get curView() { return this._curView; }
	set curView(v){
		this.showView(v);
		this._curView = v;
	}

	/**
	 * @property {DisplayObject[]} views - subviews.
	 */
	get views() { return this._views; }

	constructor( app, opts) {

		super( app, opts );

		this._views = [];

		/**
		 * Current view index, for prev/next.
		 */
		this._vIndex = -1;

	}

	/**
	 * Display next view.
	 */
	showNext() {

		let nxt = this._vIndex+1;
		if ( nxt >= this._views.length ) return;

		this.showIndex( nxt );

	}

	/**
	 * Display previous view.
	 */
	showPrev() {

		let prev = this._vIndex-1;
		if ( prev < 0 || prev >= this._views.length ) return;

		this.showIndex( prev );

	}

	/**
	 * Hide current view and display new view instead.
	 * @param {DisplayObject} v
	 */
	showView( v ) {
		this.showIndex( this._views.indexOf(v) );
	}

	showIndex( ind ) {

		if ( ind < 0 || ind >= this._views.length || ind == this._vIndex ) return false;

		if ( this._curView ) {
			this.removeChild( this._curView);
		}

		let v = this._views[ind];
		if ( !v ) return false;

		this._vIndex = ind;
		this.addChild(v);
		this._curView = v;
		v.visible = true;

		return true;

	}

	addView( v ) {
		this._views.push(v);
	}

}