import { Container, Sprite, Text, Point, Rectangle, Texture, InteractionEvent } from 'pixi.js';
import UiSkin from "../ui-skin";
import { centerOn } from '../layout-utils';

export default class Checkbox extends Container {

	_checked: boolean;

	/**
	 * {Boolean}
	 */
	get checked(): boolean { return this._checked; }
	set checked(v: boolean) {

		if (v === this._checked) return;

		this._checked = v;
		if (v === true) {

			if (this._tween) {
				this._tween.play();
			} else this.check.visible = true;

			this.emit('checked', this);

		} else {

			if (this._tween) {
				this._tween.reverse();
			} else this.check.visible = false;
			this.emit('unchecked', this);

		}
		this.emit('toggled', v);

	}

	get tween() { return this._tween; }
	set tween(v) { this._tween = v; }

	/**
	 * {string}
	 */
	get label() { return this._label; }
	set label(v) { this._label = v; }

	_tween?: any;

	_label: string;

	/// Checkbox sprite
	box: Sprite;
	/// Checkmark sprite.
	check: Sprite;

	labelClip: Text;

	/**
	 * 
	 * @param {Texture} boxTex 
	 * @param {Texture} checkTex 
	 * @param {string} [text=''] 
	 * @param {Boolean} [checked=false]
	 */
	constructor(boxTex: Texture, checkTex: Texture, label: string = '', checked: boolean = false) {

		super();

		this.interactive = true;
		this.hitArea = new Rectangle(0, 0, boxTex.width, boxTex.height);

		this.box = new Sprite(boxTex);
		this.check = new Sprite(checkTex);

		this.check.visible = this._checked = checked;

		this._label = label;
		this.labelClip = UiSkin.Default ? UiSkin.Default.makeSmallText(label) : new Text(label);

		this.addChild(this.box);
		this.addChild(this.check);
		this.addChild(this.labelClip);

		this.centerCheck(this.box, this.check);
		this.labelClip.position = new Point(

			this.box.x + this.box.width + 4,
			this.box.y + (this.box.height - this.labelClip.height) / 2

		);

		this.on('pointerup', (e: InteractionEvent) => this.checked = !this._checked);

	}

	/**
	 * Toggle the checked state.
	 */
	toggle() {
		this.checked = !this._checked;
	}

	/**
	 * Center the check Sprite within the box Sprite.
	 * @param {Sprite} box 
	 * @param {Sprite} check 
	 */
	centerCheck(box: Sprite, check: Sprite) {
		centerOn(check, box);
	}

}