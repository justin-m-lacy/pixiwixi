import * as PIXI from 'pixi.js';

/*export { default as Button } from './src/button';
export { default as Scrollbar } from './src/scrollbar';
export {default as Pane } from './src/pane';
export { default as ScrollPane } from './src/scrollPane';
export { default as Window} from './src/window';
export {default as Checkbox} from './src/checkbox';
export {default as UiSkin} from './src/uiSkin';
export {default as ProgressBar} from './src/progressBar';
export {default as  Layout} from './src/layout';*/

import Button from './src/button';
import Scrollbar from './src/scrollbar';
import Pane from './src/pane';
import ScrollPane from './src/scrollPane';
import Window from './src/window';
import Checkbox from './src/checkbox';
import UiSkin from './src/uiSkin';
import ProgressBar from './src/progressBar';
import Layout from './src/layout';

export { Button, Scrollbar, Pane, Checkbox, Window, ScrollPane, UiSkin, ProgressBar, Layout};

export const Flow = {
	VERTICAL:1,
	HORIZONTAL:2
};

export const Anchors = {

	TOP:1,
	BOTTOM:2,
	LEFT:4,
	RIGHT:8,
	CENTER:16,

};

export default {

	_wheelFunc:null,
	_wheelEnabled:false,
	_wheelScale:1,


	/**
	 * Enable scroll wheel events.
	 * @param {*} app 
	 */
	enableWheel( app ) {

		if ( this._wheelEnabled === true ) return;
	
			let mgr = app.renderer.plugins.interaction;
			this._wheelEnabled = true;
	
			// store to remove later.
			this._wheelFunc = (e)=>{
	
				let evt = new PIXI.interaction.InteractionEvent();
				let data = new PIXI.interaction.InteractionData();
		
				data.originalEvent = e;
				data.deltaY = e.deltaY*this.wheelScale;
				data.deltaX = e.deltaX*this.wheelScale;
	
				data.originalEvent = e;
	
				Object.assign( data, mgr.eventData );
	
				let target = evt.target = data.target;
				evt.data = data;
				evt.type = 'wheel';
	
				while ( target ) {
	
					if ( target.interactive === true ) {
						evt.currentTarget = target;
						target.emit( 'wheel', evt );
					}
					target = target.parent;
	
				}
	
			};
	
			app.view.addEventListener( 'wheel', _wheelFunc );	
	},
	
	/**
	* Disable wheel events.
	* @param {PIXI.Application} app - app for dispatching events.
	*/
	disableWheel( app ) {
	
			if ( this._wheelEnabled === true ) {
				app.view.removeEventListener( 'wheel', _wheelFunc );
				this._wheelFunc = null;
				this._wheelEnabled = false;
		}
	
	}

};