import { Application } from "pixi.js";
import { ScrollPane } from "./scroll-pane";
import { UiSkin } from '../ui-skin';
import { ScrollAxis } from '../scrollbar';
import { PaneOptions } from './pane';
import { ScrollPaneOpts } from './scroll-pane';

export type WindowOptions =
	ScrollPaneOpts &
	{
		canResize?: boolean,
		canDrag?: boolean
	};
export class PixiWindow extends ScrollPane {

	canResize: boolean = false;
	canDrag: boolean = false;

	/**
	 * 
	 * @param {PIXI.Application} app 
	 * @param {*} opts 
	 */
	constructor(opts?: WindowOptions) {

		super(opts);

	}

}