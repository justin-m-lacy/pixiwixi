import { Text, TextStyle, Ticker } from 'pixi.js';

/**
 * Field for displaying a message and numeric value.
 */
export class CounterField extends Text {

	/**
	 * {number}
	 */
	get value(): number { return this._value; }
	set value(v: number) { this._value = v; }

	/**
	 * {Boolean} If true, the counter will count up or down to its current value.
	 */
	get showCount(): boolean { return this._showCount; }
	set showCount(v: boolean) { this._showCount = v; }

	get label() { return this._label; }
	set label(v) {
		this._label = v;
		this.text = this.curTex();
	}

	/**
	 * Counting distance at which count will snap
	 * directly to the final value without animating.
	 */
	get snapDistance() { return this._snapDistance }
	set snapDistance(v) { this._snapDistance = v }

	/**
	 * Minimum difference in value that will trigger an animation
	 * rather than an automatic setting of the target value.
	 */
	private _snapDistance: number = 2;

	private _label: string = '';
	private _value: number = 0;
	private _targetVal: number = 0;
	private _showCount: boolean = false;
	private _animating: boolean = false;


	/// Currently displayed text.
	get text() {
		return super.text;
	}
	set text(s: string) {
		super.text = s;
	}

	/**
	 *
	 * @param {string} [text='']
	 * @param {number} [startVal=0]
	 * @param {Object} styleVars
	 */
	constructor(label = '', startVal = 0, styleVars?: TextStyle) {

		super('', styleVars);

		this._label = label;
		this._value = startVal;

		this.text = this.curTex();
		this._animating = false;

	}

	curTex(): string {
		return this._label ?
			(this._label + ': ' + Math.floor(this._value)) :
			Math.floor(this._value).toString();
	}

	/**
	 *
	 * @param {number} value
	 */
	update(value: number): void {

		if (this._showCount === true) {

			this._targetVal = value;

			// already animating.
			if (this._animating === true) return;
			else if (Math.abs(value - this._value) > this._snapDistance) {

				this.startAnimation();
				this.animate();
				return;

			}

		}

		this._value = value;
		this.text = this.curTex();

	}

	animate() {

		if (Math.abs(this._targetVal - this._value) <= this._snapDistance) {

			this._value = this._targetVal;
			this.endAnimation();

		} else {

			this._value += (this._targetVal - this.value) / 10;

		}
		this.text = this.curTex();

	}

	endAnimation() {
		Ticker.shared.remove(this.animate, this);
		this._animating = false;
	}

	startAnimation() {
		this._animating = true;
		Ticker.shared.add(this.animate, this);
	}

}