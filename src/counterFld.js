import { Text, Ticker } from 'pixi.js';

const MIN_COUNT_DIST = 2;
/**
 * Field for displaying a message and numeric value.
 */
export default class CounterField extends Text {

	/**
	 * {number}
	 */
	get value() { return this._value; }
	set value(v) { this._value = v;}

	/**
	 * {Boolean} If true, the counter will count up or down to its current value.
	 */
	get showCount() { return this._showCount; }
	set showCount(v) { this._showCount = v; }

	get label(){return this._label;}
	set label(v){
		this._label=v;
		this.text = this.curTex();
	}

	/**
	 *
	 * @param {string} [text='']
	 * @param {number} [startVal=0]
	 * @param {Object} styleVars
	 */
	constructor( label='', startVal=0, styleVars ) {

		super( '', styleVars );

		this._label = label;
		this._value = startVal;

		this.text = this.curTex();
		this._animating = false;

	}

	curTex(){return this._label ? (this._label + ': ' + Math.floor(this._value) ) : Math.floor(this._value); }

	/**
	 *
	 * @param {number} value
	 */
	update( value ) {

		if ( this._showCount === true ) {

			this._targetVal = value;

			// already animating.
			if ( this._animating === true ) return;
			else if ( Math.abs( value - this._value ) > MIN_COUNT_DIST ) {

				this.startAnimation();
				this.animate(1);
				return;

			}

		}

		this._value = value;
		this.text = this.curTex();

	}

	animate(){

		if ( Math.abs(this._targetVal- this._value ) <= MIN_COUNT_DIST ) {

			this._value = this._targetVal;
			this.endAnimation();

		} else {

			this._value += (this._targetVal - this.value )/10;

		}
		this.text = this.curTex();

	}

	endAnimation() {
		Ticker.shared.remove( this.animate, this );
		this._animating = false;
	}

	startAnimation() {
		this._animating = true;
		Ticker.shared.add( this.animate, this );
	}

}