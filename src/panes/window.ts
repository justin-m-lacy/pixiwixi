import { Application } from "pixi.js";
import ScrollPane from "./scroll-pane";
import UiSkin from '../ui-skin';
import { ScrollAxis } from '../scrollbar';

export default class Window extends ScrollPane {

	canResize: boolean = false;
	canDrag: boolean = false;

	/**
	 * 
	 * @param {PIXI.Application} app 
	 * @param {*} opts 
	 */
	constructor(app: Application, opts?: { skin?: UiSkin, axes: ScrollAxis }) {

		super(app, opts);

	}

}