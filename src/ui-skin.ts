import { Graphics, Text, Texture, InteractionEvent } from 'pixi.js';

import * as PIXI from 'pixi.js';
import { ProgressBar } from "./controls/progress-bar";
import { Checkbox } from "./controls/checkbox";

export const SkinChanged = 'skinChanged';

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export class UiSkin extends PIXI.utils.EventEmitter<'skinChanged'> {

	/**
	 * {number} width of scrollbars.
	 */
	get scrollbarWidth() { return this._scrollbarWidth; }
	set scrollbarWidth(v) {
		if (v !== this._scrollbarWidth) {
			this._scrollbarWidth = v;
			this.emit(SkinChanged, 'scrollbarWidth');
		}
	}


	/**
	 * {Number|string}
	 */
	get fontColor() { return this._baseStyle.fill; }
	set fontColor(v) {

		this._baseStyle.fill = v;
		this.emit(SkinChanged, 'fontColor');

	}

	/**
	 * {string} changes font family of the default font.
	 */
	get fontFamily(): string | string[] { return this._fontFamily!; }
	set fontFamily(v: string | string[]) {

		this._fontFamily = v;

		if (this._baseStyle) this._baseStyle.fontFamily = v;
		if (this._largeStyle) this._largeStyle.fontFamily = v;
		if (this._smallStyle) this._smallStyle.fontFamily = v;

		this.emit(SkinChanged, 'fontFamily');
	}

	get baseSize() { return this._baseStyle.fontSize; }
	set baseSize(v) {

		this._baseStyle.fontSize = v;
		this.emit(SkinChanged, 'baseSize');

	}

	/**
	 * {PIXI.TextStyle } Default text style.
	 */
	get baseStyle() { return this._baseStyle; }
	set baseStyle(v) {
		this._baseStyle = v;
		this.emit(SkinChanged, 'baseStyle');
	}

	get largeSize() { return this._largeStyle.fontSize; }
	set largeSize(v) {

		this._largeStyle.fontSize = v;
		this.emit(SkinChanged, 'largeSize');

	}

	get largeStyle() { return this._largeStyle; }
	set largeStyle(v) {
		this._largeStyle = v;
		this.emit(SkinChanged, 'largeStyle');
	}

	/**
	 * {number}
	 */
	get smallSize() { return this._smallStyle.fontSize; }
	set smallSize(v) {

		this._smallStyle.fontSize = v;

		this.emit(SkinChanged, 'smallSize');

	}

	get smallStyle() { return this._smallStyle; }
	set smallStyle(v) {

		this._smallStyle = v;
		this.emit(SkinChanged, 'smallStyle');
	}

	/**
	 * {Texture}
	 */
	get checkmark() { return this._checkmark; }
	set checkmark(v) {
		this._checkmark = v;
		this.emit(SkinChanged, 'checkmark');
	}

	/**
	 * x-mark
	 */
	get cross() { return this._cross; }
	set cross(v) {
		this._cross = v;
		this.emit(SkinChanged, 'cross');
	}


	/**
	 * {Texture}
	 */
	get box() { return this._box; }
	set box(v) {
		this._box = v;
		this.emit(SkinChanged, 'box');
	}

	get caret() {
		return this._caret;
	}
	set caret(v) {
		this._caret = v;
		this.emit(SkinChanged, 'caret');
	}

	/**
	 * Box background texture.
	 */
	private _box?: Texture;

	/**
	 * Check mark for checkboxes.
	 */
	private _checkmark?: Texture;

	/**
	 * Simple X-mark
	 */
	private _cross?: Texture;
	private _caret?: Texture;

	private _scrollbarWidth: number = 32;

	private _largeStyle: PIXI.TextStyle;
	private _smallStyle: PIXI.TextStyle;
	private _baseStyle: PIXI.TextStyle;

	private _skinData: Map<string, any>;
	private _fontFamily?: string | string[];

	/**
	 *
	 * @param {Object} [vars=null]
	 */
	constructor(vars?: Partial<UiSkin>) {

		super();

		this._scrollbarWidth = vars?.scrollbarWidth ?? 18;

		this._fontFamily = vars?.fontFamily;

		this._largeStyle = vars?.largeStyle ??
			new PIXI.TextStyle({ fontFamily: this._fontFamily });
		this._smallStyle = vars?.smallStyle ??
			new PIXI.TextStyle({ fontFamily: this._fontFamily });
		this._baseStyle = vars?.baseStyle ??
			new PIXI.TextStyle({ fontFamily: this._fontFamily });

		if (vars) {

			this._box = vars.box;
			this._checkmark = vars.checkmark;
			this._cross = vars.cross;
			this._caret = vars.caret;

			if (vars.smallSize) {
				this.smallStyle.fontSize = vars.smallSize;
			}
			if (vars.largeSize) {
				this.largeStyle.fontSize = vars.largeSize;
			}
			if (vars.baseSize) {
				this.baseStyle.fontSize = vars.baseSize;
			}

		}


		this._skinData = new Map();

	}

	/**
	 * Just creates a sprite with a click listener. Included for completeness.
	 * @param {PIXI.Texture} tex
	 * @param {Function} [onClick=null] - function to call on click.
	 * @param {*} [context=null] - context of the event listener.
	 */
	makeIconButton(tex: Texture, onClick?: PIXI.utils.EventEmitter.ListenerFn, context?: any) {

		let clip = new PIXI.Sprite(tex);

		clip.interactive = true;

		if (onClick) {
			clip.on('click', onClick, context);
		}

		return clip;

	}

	/**
	 *
	 * @param {string} str
	 * @param {Function} [onClick=null]
	 * @param {*} [context=null]
	 */
	makeTextButton(str: string, onClick: (d: InteractionEvent) => void, context?: any) {

		let clip = new PIXI.Container();

		console.assert(this._box != null, 'Skin box is null');
		let mesh = new PIXI.NineSlicePlane(this._box!);

		console.assert(this._smallStyle != null, 'Small style null');
		let text = this.makeTextSmall(str);
		text.x = 4;

		mesh.width = text.width + 8;

		clip.interactive = true;
		clip.addChild(mesh, text);

		if (onClick !== null) {
			clip.on('pointerdown', onClick, context);
		}

		return clip;


	}

	/**
	 *
	 * @param {string} str
	 * @param {Boolean} [clone=false]
	 */
	makeTextLarge(str: string, clone = false) {
		if (clone === true) {
			return new Text(str, this._largeStyle.clone());
		}
		return new Text(str, this._largeStyle);
	}

	/**
	 *
	 * @param {string} str
	 * @param {Boolean} [clone=false]
	 */
	makeTextSmall(str: string, clone = false) {
		if (clone === true) {
			return new Text(str, this._smallStyle.clone());
		}
		return new Text(str, this._smallStyle);
	}

	makeText(str: string = '', clone = false) {
		if (clone === true) {
			return new Text(str, this._baseStyle.clone());
		}
		return new Text(str, this._baseStyle);
	}

	/**
	 *
	 * @param {string} label
	 * @param {Boolean} [checked=false]
	 */
	makeCheckbox(label: string, checked = false) {
		return new Checkbox(
			this._skinData.get('box'),
			this._skinData.get('checkmark'),
			label,
			checked);
	}

	makeProgressBar() {

		let backTex = this._skinData.get('box');
		let barTex = this._skinData.get('bar');

		console.assert(backTex != null && barTex != null, 'Missing Skin box or bar: ' + backTex + ' , ' + barTex);

		let p = new ProgressBar(
			new PIXI.NineSlicePlane(backTex),
			new PIXI.NineSlicePlane(barTex)
		);

		return p;

	}

	/**
	 *
	 * @param {number} [width=200]
	 * @param {number} [height=200]
	 */
	makePane(width = 200, height = 200) {

		let data = this._skinData.get('frame');
		if (data instanceof PIXI.Texture) {

			let pane = new PIXI.NineSlicePlane(data);
			pane.width = width;
			pane.height = height;

			return pane;

		}
	}

	/**
	 *
	 * @param {string} key
	 * @param {number} left
	 * @param {number} top
	 * @param {number} right
	 * @param {number} bottom
	 */
	makeNineSlice(key: string, left: number = 12, top: number = 8, right: number = 12, bottom: number = 8) {

		let data = this._skinData.get(key);
		if (!(data instanceof PIXI.Texture)) return null;

		return new PIXI.NineSlicePlane(data, left, top, right, bottom);

	}

	/**
	 * Generate a texture from Graphics and add it
	 * to the skin under key.
	 * @param {string} key
	 * @param {Graphics} g
	 */
	addAsTexture(key: string, g: Graphics): Texture {

		const renderer = PIXI.autoDetectRenderer();
		const size = g.getBounds();
		const tex = PIXI.RenderTexture.create({ width: size.width, height: size.height });

		renderer.render(g, { renderTexture: tex });

		this._skinData.set(key, tex);
		return tex;

	}

	/**
	 * Set the skinning data for a given key. The data can be style information,
	 * a texture, or any information relevant to ui display.
	 * A skinChanged event will be fired, notifying listeners of the change.
	 * @param {string} key
	 * @param {*} obj
	 */
	setSkinData(key: string, obj: Object) {

		this._skinData.set(key, obj);
		this.emit(SkinChanged, obj);

	}

	/**
	 * Get the skinning data associated with a key.
	 * @param {string} key
	 */
	getSkinData<T>(key: string) {
		return this._skinData.get(key);
	}

}