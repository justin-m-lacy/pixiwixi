import { Text, Texture, InteractionEvent, DisplayObject, TextStyle, LineStyle, FillStyle, GraphicsData } from 'pixi.js';

import * as PIXI from 'pixi.js';
import { ProgressBar } from "./controls/progress-bar";
import { Checkbox } from "./controls/checkbox";

export const SkinChanged = 'skinChanged';

/**
 * Keys to skinData. currently these are only used to store textures.
 */
export enum SkinKey {

	frame = 'frame',
	box = 'box',
	checkmark = 'checkmark',
	bar = 'bar',
	cross = 'cross',
	caret = 'caret'

}


export type UiData = DisplayObject | Texture | TextStyle | LineStyle | FillStyle | GraphicsData;

/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export class UiSkin extends PIXI.utils.EventEmitter<'skinChanged'> {

	/**
	 * width of scrollbars.
	 */
	get scrollbarWidth() { return this._scrollbarWidth; }
	set scrollbarWidth(v) {
		if (v !== this._scrollbarWidth) {
			this._scrollbarWidth = v;
			this.emit(SkinChanged, 'scrollbarWidth');
		}
	}


	/**
	 * Base font color.
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
	 * Check symbol for checkboxes.
	 */
	get checkmark() { return this._textures.get(SkinKey.checkmark); }
	set checkmark(v) {
		if (v) {
			this._textures.set(SkinKey.checkmark, v);
		} else {
			this._textures.delete(SkinKey.checkmark);
		}
		this.emit(SkinChanged, SkinKey.checkmark);
	}

	/**
	 * A cross mark symbol.
	 */
	get cross() { return this._textures.get(SkinKey.cross) }
	set cross(v) {
		if (v) {
			this._textures.set(SkinKey.cross, v);
		} else {
			this._textures.delete(SkinKey.cross);
		}
		this.emit(SkinChanged, SkinKey.cross);
	}


	get box() { return this._textures.get(SkinKey.box); }
	set box(v) {
		if (v) {
			this._textures.set(SkinKey.box, v);
		} else {
			this._textures.delete(SkinKey.box);
		}
		this.emit(SkinChanged, SkinKey.box);
	}

	/**
	 * Caret for textboxes.
	 */
	get caret() {
		return this._textures.get(SkinKey.caret)
	}
	set caret(v) {
		if (v) {
			this._textures.set(SkinKey.caret, v);
		} else {
			this._textures.delete(SkinKey.caret);
		}
		this.emit(SkinChanged, SkinKey.caret);
	}


	private _scrollbarWidth: number = 32;

	private _largeStyle: PIXI.TextStyle;
	private _smallStyle: PIXI.TextStyle;
	private _baseStyle: PIXI.TextStyle;

	private readonly _textures: Map<SkinKey, UiData> = new Map();
	private _fontFamily?: string | string[];

	public set renderer(v: PIXI.Renderer) { this._renderer = v }
	private _renderer?: PIXI.Renderer;

	/**
	 *
	 * @param {Object} [vars=null]
	 */
	constructor(vars?: Partial<UiSkin> & { renderer?: PIXI.Renderer }) {

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

			if (vars.box) {
				this._textures.set(SkinKey.box, vars.box);
			}
			if (vars.checkmark) {
				this._textures.set(SkinKey.checkmark, vars.checkmark);
			}
			if (vars.cross) {
				this._textures.set(SkinKey.cross, vars.cross);
			}
			if (vars.caret) {
				this._textures.set(SkinKey.caret, vars.caret);
			}

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

		let mesh = new PIXI.NineSlicePlane(this.box! as Texture);
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
			this._textures.get(SkinKey.box)! as Texture,
			this._textures.get(SkinKey.checkmark)! as Texture,
			label,
			checked);
	}

	makeProgressBar() {

		let backTex = this._textures.get(SkinKey.box)!;
		let barTex = this._textures.get(SkinKey.bar)!;

		if (!backTex) {
			throw new Error(`Missing skin data: ${SkinKey.box}`)
		} else if (!barTex) {
			throw new Error(`Missing skin data: ${SkinKey.bar}`)
		}

		let p = new ProgressBar(
			new PIXI.NineSlicePlane(backTex as Texture),
			new PIXI.NineSlicePlane(barTex as Texture)
		);

		return p;

	}

	/**
	 *
	 * @param {number} [width=200]
	 * @param {number} [height=200]
	 */
	makeFrame(width = 200, height = 200) {

		let data = this._textures.get(SkinKey.frame);
		if (data instanceof PIXI.Texture) {

			let pane = new PIXI.NineSlicePlane(data);
			pane.width = width;
			pane.height = height;

			return pane;

		}
	}

	/**
	 * Generate a texture from a display object and add it under the texture key.
	 * @param {string} key
	 * @param {Graphics} g
	 */
	addTexture(key: SkinKey, g: DisplayObject): Texture {

		const renderer = this._renderer ?? PIXI.autoDetectRenderer();
		const size = g.getBounds();
		const tex = PIXI.RenderTexture.create({ width: size.width, height: size.height });

		renderer.render(g, { renderTexture: tex, clear: false });

		this._textures.set(key, tex);
		return tex;

	}

	/**
	 * Set the skinning data for a given key. The data can be style information,
	 * a texture, or any information relevant to ui display.
	 * A skinChanged event will be fired, notifying listeners of the change.
	 * @param key
	 * @param {*} obj
	 */
	setSkinData(key: SkinKey, obj: UiData) {

		this._textures.set(key, obj);
		this.emit(SkinChanged, obj);

	}

	/**
	 * Get the skinning data associated with a key.
	 * @param {string} key
	 */
	getSkinData<T>(key: SkinKey) {
		return this._textures.get(key);
	}

}