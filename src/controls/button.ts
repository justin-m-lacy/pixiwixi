import { DisplayObject, InteractionEvent } from "pixi.js";

export class Button {

	get onClick() { return this._onClick; }
	set onClick(v) { this._onClick = v; }

	readonly clip: DisplayObject;
	_onClick?: () => void;


	/**
	 * 
	 * @param {DisplayObject} clip 
	 */
	constructor(clip: DisplayObject, onClick?: () => void) {

		this._onClick = onClick;
		this.clip = clip;
		this.clip.interactive = true;
		this.clip.on('pointerup', this._clickFunc, this);

	}

	private _clickFunc(e: InteractionEvent): void {
		this._onClick?.();
	}

	destroy() {
		this.clip.destroy();
		this._onClick = undefined;
	}

}