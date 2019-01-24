import { Text, ticker } from 'pixi.js';

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

	/**
	 * 
	 * @param {string} [text=''] 
	 * @param {number} [startVal=0] 
	 * @param {Object} styleVars 
	 */
	constructor( text='', startVal=0, styleVars ) {

		super( text + ': ' + startVal, styleVars );

		this._labelText = text;
		this._value = startVal;
	
		this._animating = false;

	}

	/**
	 * 
	 * @param {number} value 
	 */
	update( value ) {

		if ( this._showCount === true ) {

			this._targetVal = value;

			// already animating.
			if ( this._animating === true ) return;
			else if ( Math.abs( value - this.value ) > MIN_COUNT_DIST ) {
	
				this.startAnimation();
				this.animate(1);
				return;

			}

		}

		this.value = value;
		this.text = this._labelText + ': ' + this.value;

	}

	animate(delta){

		if ( Math.abs(this._targetVal- this.value ) <= MIN_COUNT_DIST ) {

			this.value = this._targetVal;
			this.endAnimation();

		} else {

			this.value += (this._targetVal - this.value )/10;

		}
		this.text = this._labelText + ': ' + Math.round(this.value );

	}

	endAnimation() {
		ticker.shared.remove( this.animate, this );
		this._animating = false;
	}

	startAnimation() {
		this._animating = true;
		ticker.shared.add( this.animate, this );
	}

}