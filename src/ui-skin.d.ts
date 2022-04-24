import { Graphics, Text, Texture, InteractionEvent } from 'pixi.js';
import * as PIXI from 'pixi.js';
import ProgressBar from "./controls/progress-bar";
import Checkbox from "./controls/checkbox";
export declare const SkinChanged = "skin-changed";
/**
 * All the miscellaneous data and objects to define
 * the general look of the UI.
 */
export default class UiSkin extends PIXI.utils.EventEmitter {
    static Default?: UiSkin;
    static SetDefaultSkin(skin: UiSkin): void;
    static GetDefaultSkin(): UiSkin | undefined;
    _scrollbarWidth: number;
    /**
     * {number} width of scrollbars.
     */
    get scrollbarWidth(): number;
    set scrollbarWidth(v: number);
    /**
     * {Number|string}
     */
    get fontColor(): PIXI.TextStyleFill;
    set fontColor(v: PIXI.TextStyleFill);
    /**
     * {string} changes font family of the default font.
     */
    get fontFamily(): string | string[];
    set fontFamily(v: string | string[]);
    get baseSize(): string | number;
    set baseSize(v: string | number);
    /**
     * {PIXI.TextStyle } Default text style.
     */
    get baseStyle(): PIXI.TextStyle;
    set baseStyle(v: PIXI.TextStyle);
    get largeSize(): string | number;
    set largeSize(v: string | number);
    get largeStyle(): PIXI.TextStyle;
    set largeStyle(v: PIXI.TextStyle);
    /**
     * {number}
     */
    get smallSize(): string | number;
    set smallSize(v: string | number);
    get smallStyle(): PIXI.TextStyle;
    set smallStyle(v: PIXI.TextStyle);
    /**
     * {Texture}
     */
    get checkmark(): Texture<PIXI.Resource> | undefined;
    set checkmark(v: Texture<PIXI.Resource> | undefined);
    /**
     * x-mark
     */
    get cross(): Texture<PIXI.Resource> | undefined;
    set cross(v: Texture<PIXI.Resource> | undefined);
    /**
     * {Texture}
     */
    get box(): Texture<PIXI.Resource> | undefined;
    set box(v: Texture<PIXI.Resource> | undefined);
    get caret(): Texture<PIXI.Resource> | undefined;
    set caret(v: Texture<PIXI.Resource> | undefined);
    /**
     * Box background texture.
     */
    private _box?;
    /**
     * Check mark for checkboxes.
     */
    private _checkmark?;
    /**
     * Simple X-mark
     */
    private _cross?;
    private _caret?;
    private _largeStyle;
    private _smallStyle;
    private _baseStyle;
    private _skinData;
    private _fontFamily?;
    /**
     *
     * @param {Object} [vars=null]
     */
    constructor(vars?: Partial<UiSkin>);
    /**
     * Just creates a sprite with a click listener. Included for completeness.
     * @param {PIXI.Texture} tex
     * @param {Function} [onClick=null] - function to call on click.
     * @param {*} [context=null] - context of the event listener.
     */
    makeIconButton(tex: Texture, onClick?: PIXI.utils.EventEmitter.ListenerFn, context?: any): PIXI.Sprite;
    /**
     *
     * @param {string} str
     * @param {Function} [onClick=null]
     * @param {*} [context=null]
     */
    makeTextButton(str: string, onClick: (d: InteractionEvent) => void, context?: any): PIXI.Container;
    /**
     *
     * @param {string} str
     * @param {Boolean} [clone=false]
     */
    makeTextLarge(str: string, clone?: boolean): Text;
    /**
     *
     * @param {string} str
     * @param {Boolean} [clone=false]
     */
    makeTextSmall(str: string, clone?: boolean): Text;
    makeText(str?: string, clone?: boolean): Text;
    /**
     *
     * @param {string} label
     * @param {Boolean} [checked=false]
     */
    makeCheckbox(label: string, checked?: boolean): Checkbox;
    makeProgressBar(): ProgressBar;
    /**
     *
     * @param {number} [width=200]
     * @param {number} [height=200]
     */
    makePane(width?: number, height?: number): PIXI.NineSlicePlane | undefined;
    /**
     *
     * @param {string} key
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     */
    makeNineSlice(key: string, left?: number, top?: number, right?: number, bottom?: number): PIXI.NineSlicePlane | null;
    /**
     * Generate a texture from Graphics and add it
     * to the skin under key.
     * @param {string} key
     * @param {Graphics} g
     */
    addAsTexture(key: string, g: Graphics): Texture;
    /**
     * Set the skinning data for a given key. The data can be style information,
     * a texture, or any information relevant to ui display.
     * A 'skin-changed' event will be fired, notifying listeners of the change.
     * @param {string} key
     * @param {*} obj
     */
    setSkinData(key: string, obj: Object): void;
    /**
     * Get the skinning data associated with a key.
     * @param {string} key
     */
    getSkinData<T>(key: string): any;
}
