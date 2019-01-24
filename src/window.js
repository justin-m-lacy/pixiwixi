import ScrollPane from "./scrollPane";

export default class Window extends ScrollPane {

	get canDrag() { return this._canDrag; }
	set canDrag(v) { this._canDrag  = v;}

	get canResize() { return this._canResize; }
	set canResize(v) { this._canResize = v; }

	/**
	 * 
	 * @param {PIXI.Application} app 
	 * @param {*} opts 
	 */
	constructor( app, opts=null ) {

		super( app, opts );

	}

}