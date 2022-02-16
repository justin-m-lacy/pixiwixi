import { Graphics, Text, Texture, InteractionEvent } from 'pixi.js';

import * as PIXI from 'pixi.js';
import ProgressBar from "./controls/progress-bar";
import Checkbox from "./controls/checkbox";
import { CanvasRenderer } from '@pixi/canvas-renderer';

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export default class UiSkin extends PIXI.utils.EventEmitter {

	static Default?: UiSkin;

	static SetDefaultSkin(skin: UiSkin) {
		UiSkin.Default = skin;
	}

	static GetDefaultSkin(): UiSkin | undefined {
		return UiSkin.Default;
	}

	_scrollbarWidth: number = 32;
	/**
	 * {number} width of scrollbars.
	 */
	get scrollbarWidth() { return this._scrollbarWidth; }
	set scrollbarWidth(v) { this._scrollbarWidth = v; }


	/**
	 * {Number|string}
	 */
	get fontColor() { return this._defaultStyle.fill; }
	set fontColor(v) {

		this._defaultStyle.fill = v;
		this.emit('skin-changed', 'fontColor');

	}

	/**
	 * {string} changes font family of the default font.
	 */
	get fontFamily(): string | string[] { return this._fontFamily!; }
	set fontFamily(v: string | string[]) {

		this._fontFamily = v;

		if (this._defaultStyle) this._defaultStyle.fontFamily = v;
		if (this._largeStyle) this._largeStyle.fontFamily = v;
		if (this._smallStyle) this._smallStyle.fontFamily = v;

		this.emit('skin-changed', 'fontFamily');
	}

	/**
	 * {PIXI.TextStyle } Default text style.
	 */
	get defaultStyle() { return this._defaultStyle; }
	set defaultStyle(v) {
		this._defaultStyle = v;
		this.emit('skin-changed', 'defaultStyle');
	}

	/**
	 * {number}
	 */
	get largeSize() { return this._largeStyle.fontSize; }
	set largeSize(v) {

		this._largeStyle.fontSize = v;
		this.emit('skin-changed', 'largeSize');

	}

	get largeStyle() { return this._largeStyle; }
	set largeStyle(v) {
		this._largeStyle = v;
		this.emit('skin-changed', 'largeStyle');
	}

	/**
	 * {number}
	 */
	get smallSize() { return this._smallStyle.fontSize; }
	set smallSize(v) {

		this._smallStyle.fontSize = v;

		this.emit('skin-changed', 'smallSize');

	}

	get smallStyle() { return this._smallStyle; }
	set smallStyle(v) {

		this._smallStyle = v;
		this.emit('skin-changed', 'smallStyle');
	}

	/**
	 * {Texture}
	 */
	get checkmark() { return this._checkmark; }
	set checkmark(v) {
		this._checkmark = v;
		this.emit('skin-changed', 'checkmark');
	}

	/**
	 * x-mark
	 */
	get cross() { return this._cross; }
	set cross(v) {
		this._cross = v;
		this.emit('skin-changed', 'cross');
	}


	/**
	 * {Texture}
	 */
	get box() { return this._box; }
	set box(v) {
		this._box = v;
		this.emit('skin-changed', 'box');
	}

	_box?: Texture;
	_checkmark?: Texture;
	_cross?: Texture;

	_largeStyle: PIXI.TextStyle;
	_smallStyle: PIXI.TextStyle;
	_defaultStyle: PIXI.TextStyle;

	_skinData: Map<string, any>;
	_fontFamily?: string | string[];

	/**
	 *
	 * @param {Object} [vars=null]
	 */
	constructor(vars?: Partial<UiSkin>) {

		super();

		this._scrollbarWidth = 18;

		if (vars) Object.assign(this, vars);

		this._largeStyle = vars?.largeStyle ?? new PIXI.TextStyle({ fontFamily: this._fontFamily });
		this._smallStyle = vars?.smallStyle || new PIXI.TextStyle({ fontFamily: this._fontFamily });
		this._defaultStyle = vars?.defaultStyle || new PIXI.TextStyle({ fontFamily: this._fontFamily });

		this._skinData = new Map();

	}

	/**
	 * Just creates a sprite with a click listener. Included for completeness.
	 * @param {PIXI.Texture} tex
	 * @param {Function} [onClick=null] - function to call on click.
	 * @param {*} [context=null] - context of the event listener.
	 */
	makeIconButton(tex: Texture, onClick?: Function, context?: any) {

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
		let text = this.makeSmallText(str);
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
	makeLargeText(str: string, clone = false) {
		if (clone === true) return new Text(str, this._largeStyle.clone());
		return new Text(str, this._largeStyle);
	}

	/**
	 *
	 * @param {string} str
	 * @param {Boolean} [clone=false]
	 */
	makeSmallText(str: string, clone = false) {
		if (clone === true) return new Text(str, this._smallStyle.clone());
		return new Text(str, this._smallStyle);
	}

	makeText(str: string = '', clone = false) {
		if (clone === true) return new Text(str, this._defaultStyle.clone());
		return new Text(str, this._defaultStyle);
	}

	/**
	 *
	 * @param {string} label
	 * @param {Boolean} [checked=false]
	 */
	makeCheckbox(label: string, checked = false) {
		return new Checkbox(this._skinData.get('box'), this._skinData.get('checkmark'), label, checked);
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
		if (!(data instanceof PIXI.Texture)) return undefined;

		let pane = new PIXI.NineSlicePlane(data);
		pane.width = width;
		pane.height = height;

		return pane;

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
	 * Generate a texture from the given Graphics and add it
	 * to the skin under the given key.
	 * @param {string} key
	 * @param {Graphics} g
	 */
	addAsTexture(key: string, g: Graphics): Texture {

		const renderer = PIXI.autoDetectRenderer();
		const size = g.getBounds();
		const tex = PIXI.RenderTexture.create({ width: size.width, height: size.height });

		renderer.render(g, tex);

		this._skinData.set(key, tex);
		return tex;

	}

	/**
	 * Set the skinning data for a given key. The data can be style information,
	 * a texture, or any information relevant to ui display.
	 * A 'skin-changed' event will be fired, notifying listeners of the change.
	 * @param {string} key
	 * @param {*} obj
	 */
	setSkinData(key: string, obj: Object) {

		this._skinData.set(key, obj);
		this.emit('skin-changed', obj);

	}

	/**
	 * Get the skinning data associated with a key.
	 * @param {string} key
	 */
	getSkinData<T>(key: string) {
		return this._skinData.get(key);
	}

}