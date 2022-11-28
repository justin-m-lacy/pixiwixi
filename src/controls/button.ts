import { Pane, PaneOptions } from '../panes/pane';
import { DisplayObject, Container } from 'pixi.js';
export class Button extends Pane {

	/**
	 * 
	 * @param {DisplayObject} clip 
	 */
	constructor(opts?: PaneOptions & { onClick?: () => void, child?: Container }) {

		super(opts);

		this.interactive = true;
		if (opts) {
			if (opts.onClick) {
				this.on('pointerup', opts.onClick);
			}
			if (opts.child) {
				const child = this.addChild(opts.child);

				child.position.set(
					(this.width - child.width) / 2,
					(this.height - child.height) / 2,
				);
			}
		}

	}

}