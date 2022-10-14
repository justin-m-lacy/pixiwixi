/**
 * Basic Skin and UI Components for UI prototyping.
 */
import { Graphics, Texture, TextStyle } from 'pixi.js';
import { SkinKey, UiSkin } from './ui-skin';

/**
 * 
 * @param {Object} [opts=null] 
 */
export const MakeSkin = (opts?: Partial<UiSkin> & { foreColor?: number, backColor?: number }) => {

	let skin = new UiSkin(opts);

	skin.smallStyle = skin.smallStyle || new TextStyle({

		fontFamily: skin.fontFamily || '',
		fontSize: skin.smallSize || 12,
		fill: skin.fontColor || 0
	});

	let foreColor = opts?.foreColor ?? 0x444444;
	let backColor = opts?.backColor ?? 0xfefefe;

	if (!skin.cross) {
		skin.cross = addCross(skin, 24, 12, foreColor);
	}
	if (!skin.box) {
		skin.box = addRoundRect(skin, SkinKey.box, 32, backColor, foreColor);
	}
	if (!skin.checkmark) {
		skin.checkmark = addCheck(skin, 32, 12, foreColor);
	}
	if (!skin.caret) {
		skin.caret = addCaret(skin, { height: 18, color: 0, thickness: 2 });
	}

	addFrame(skin, 64, 1, backColor, foreColor);
	addBar(skin, 128, 32, foreColor);

	return skin;

}

const addCaret = (skin: UiSkin, data?: {
	height?: number,
	color?: number,
	thickness?: number
}) => {

	const thick = data?.thickness ?? 2;
	let g = new Graphics();
	g.lineStyle(thick, data?.color ?? 0);
	g.lineTo(-thick / 2, data?.height ?? 20);

	let tex = skin.addTexture(SkinKey.caret, g);

	g.destroy();

	return tex;
}

const addBar = (skin: UiSkin, width: number = 128, height: number = 32, foreColor: number = 0) => {

	let g = new Graphics();
	g.beginFill(foreColor);
	g.lineStyle(1, foreColor);
	g.drawRoundedRect(0, 0, width, height, (width + height) / 10);
	g.endFill();

	let tex = skin.addTexture(SkinKey.bar, g);

	g.destroy();

	return tex;

}

const addFrame = (skin: UiSkin, size: number = 64, thickness: number = 1, backColor: number = 0, foreColor: number = 0xffffff) => {

	let g = new Graphics();
	g.beginFill(backColor);
	g.lineStyle(thickness, foreColor);
	g.drawRect(0, 0, size, size);
	g.endFill();

	let tex = skin.addTexture(SkinKey.frame, g);

	g.destroy();

	return tex;

}

const addCheck = (skin: UiSkin, size: number = 32, thickness: number = 8, color: number = 0): Texture => {

	let g = new Graphics();
	g.lineStyle(thickness, color);

	g.moveTo(-0.45 * size, 0);
	g.lineTo(0, 0.40 * size);
	g.lineTo(0.54 * size, -0.58 * size);

	let tex = skin.addTexture(SkinKey.checkmark, g);
	g.destroy();

	return tex;

}

const addCross = (skin: UiSkin, size: number = 32, thickness: number = 8, color: number = 0): Texture => {

	let g = new Graphics();
	g.lineStyle(thickness, color);
	g.moveTo(0, 0);
	g.lineTo(size, size);
	g.moveTo(size, 0);
	g.lineTo(0, size);

	let tex = skin.addTexture(SkinKey.cross, g);
	g.destroy();

	return tex;

}

const addRoundRect = (skin: UiSkin, key: SkinKey, size: number = 32, fillColor: number = 0xffffff, lineColor: number = 0): Texture => {

	let g = new Graphics();
	g.beginFill(fillColor);
	g.lineStyle(1, lineColor);
	g.drawRoundedRect(0, 0, size, size, 4);
	g.endFill();

	let tex = skin.addTexture(key, g);

	g.destroy();

	return tex;

}