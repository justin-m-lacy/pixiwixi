import { Pane, PaneOptions } from '../panes/pane';
export class Button extends Pane {

	/**
	 * 
	 * @param {DisplayObject} clip 
	 */
	constructor(opts?: PaneOptions & { onClick?: () => void }) {

		super(opts);

		this.interactive = true;
		if (opts?.onClick) {
			this.on('pointerup', opts.onClick);
		}

	}

}