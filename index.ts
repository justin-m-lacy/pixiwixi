import * as PIXI from 'pixi.js';

import { Scrollbar } from './src/scrollbar';
import { Pane } from './src/panes/pane';
import { PixiWindow } from './src/panes/window';
import { TabbedPane } from './src/panes/tabbed-pane';
import { ScrollPane } from './src/panes/scroll-pane';

import { CounterField } from './src/controls/counter-field';
import { Button } from './src/controls/button';
import { Checkbox } from './src/controls/checkbox';
import { ProgressBar } from './src/controls/progress-bar';

import { UiSkin } from './src/ui-skin';
import { DisplayObject } from 'pixi.js';

export { Button, Scrollbar, Pane, Checkbox, PixiWindow as Window, ScrollPane, UiSkin, ProgressBar, CounterField, TabbedPane as MultiPane };

export enum FlowDirection {
	Horizontal,
	Vertical
}
export enum Anchors {

	Top,
	Bottom,
	Left,
	Right,
	Center,

};

type PixiWixi = {
	_wheelFunc?: (ev: WheelEvent) => void,
	_wheelEnabled: boolean,
	_wheelScale: number,
	enableWheel(app: PIXI.Application): void,
	disableWheel(app: PIXI.Application): void

}

export const Default: PixiWixi = {

	_wheelFunc: undefined,
	_wheelEnabled: false,
	_wheelScale: 1,


	/**
	 * Enable scroll wheel events.
	 * @param {*} app
	 */
	enableWheel(app: PIXI.Application) {

		if (this._wheelEnabled === true) return;

		let mgr = app.renderer.plugins.interaction;
		this._wheelEnabled = true;

		// store to remove later.
		this._wheelFunc = (e: WheelEvent) => {

			let evt = new PIXI.InteractionEvent();
			let data = new PIXI.InteractionData();

			data.originalEvent = e;
			e.deltaY * this._wheelScale;
			e.deltaX * this._wheelScale;

			data.originalEvent = e;

			Object.assign(data, mgr.eventData);

			let target: DisplayObject = evt.target = data.target;
			evt.data = data;
			evt.type = 'wheel';

			while (target) {

				if (target.interactive === true) {
					evt.currentTarget = target;
					target.emit('wheel', evt);
				}
				target = target.parent;

			}

		};

		app.view.addEventListener('wheel', this._wheelFunc);
	},

	/**
	* Disable wheel events.
	* @param {PIXI.Application} app - app for dispatching events.
	*/
	disableWheel(app) {

		if (this._wheelEnabled === true) {
			if (this._wheelFunc != null) {
				app.view.removeEventListener('wheel', this._wheelFunc!);
			}
			this._wheelFunc = undefined;
			this._wheelEnabled = false;
		}

	}

};