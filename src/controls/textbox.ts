import { Text, InteractionEvent, DisplayObject, TextMetrics, TextStyle } from 'pixi.js';
import { Pane } from '../panes/pane';
import { FocusManager } from '../focus-manager';
import { Tween } from '@tweenjs/tween.js';

export class TextBox extends Pane {

    get style(): TextStyle {
        return this.text.style as TextStyle;
    }
    set style(v: TextStyle) {
        this.text.style = v;

    }

    get value(): string {
        return this._value;
    }
    set value(v: string) {
        this._value = v;
    }

    _value: string = '';
    _hasFocus: boolean = false;

    text: Text;
    caret?: DisplayObject;
    /**
     * Caret blink tween.
     */
    readonly blink?: Tween<DisplayObject>;

    //textMetrics: TextMetrics;

    constructor(style: TextStyle) {

        super();


        this.text = new Text(this._value, style);

        this.interactive = true;
        this.on('pointerup', this.focus);


    }

    focus(evt: InteractionEvent) {

        if (!this._hasFocus) {

            this._hasFocus = true;
            window.addEventListener('keydown', this.onKeyDown);
            if (FocusManager.Current) {
                FocusManager.Current.currentFocus = this;
            }
        }
    }

    private startBlink() {

        if (this.caret) {
            new Tween(this.caret!).start();
        }
    }

    protected onKeyDown(evt: KeyboardEvent) {

        const inKey = evt.key;
        this._value += inKey;
        this.text.text = this._value;

        const metrics = TextMetrics.measureText(this.text.text, this.text.style as TextStyle);

    }

    unfocus() {

        if (this._hasFocus) {
            window.removeEventListener('keydown', this.onKeyDown);
            this._hasFocus = false;
        }

    }

    destroy() {

        if (this._hasFocus) {
            this.unfocus();
        }

        super.destroy({ children: true });
    }
}