import { DisplayObject, InteractionEvent } from "pixi.js";

export default class Button {

	get onClick(): Function | undefined { return this._onClick; }
	set onClick(v: Function | undefined) { this._onClick = v; }

	readonly clip: DisplayObject;
	_onClick?: Function;


	/**
	 * 
	 * @param {DisplayObject} clip 
	 */
	constructor(clip: DisplayObject, onClick?: Function) {

		this._onClick = onClick;
		this.clip = clip;
		this.clip.on('pointerup', this._clickFunc);

	}

	_clickFunc(e: InteractionEvent): void {
		if (this._onClick) {
			this._onClick();
		}
	}

	destroy() {
		this.clip.destroy();
		this._onClick = undefined;
	}

}