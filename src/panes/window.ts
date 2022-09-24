import { ScrollPane } from "./scroll-pane";
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