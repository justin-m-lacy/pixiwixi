/**
 * Basic Skin and UI Components for UI prototyping.
 */
import * as PIXI from 'pixi.js';
import { Graphics, Texture } from 'pixi.js';
import UiSkin from './ui-skin';

/**
 * 
 * @param {Object} [opts=null] 
 */
export function MakeSkin(opts?: Partial<UiSkin> & { foreColor?: number, backColor?: number }) {

	let skin = new UiSkin(opts);

	skin.smallStyle = skin.smallStyle || new PIXI.TextStyle({

		fontFamily: skin.fontFamily || '',
		fontSize: skin.smallSize || 12,
		fill: skin.fontColor || 0
	});

	let foreColor = opts?.foreColor ?? 0x444444;
	let backColor = opts?.backColor ?? 0xfefefe;

	skin.cross = addCross(skin, 'cross', 24, 12, foreColor);
	skin.box = addRoundRect(skin, 'box', 32, backColor, foreColor);
	skin.checkmark = addCheck(skin, 'check', 32, 12, foreColor)
	addFrame(skin, 64, 1, backColor, foreColor);
	addBar(skin, 128, 32, foreColor);

	UiSkin.SetDefaultSkin(skin);


	return skin;

}

function addBar(skin: UiSkin, width: number = 128, height: number = 32, foreColor: number = 0) {

	let g = new Graphics();
	g.beginFill(foreColor);
	g.lineStyle(1, foreColor);
	g.drawRoundedRect(0, 0, width, height, (width + height) / 10);
	g.endFill();

	let tex = skin.addAsTexture('bar', g);

	g.destroy();

	return tex;

}

function addFrame(skin: UiSkin, size: number = 64, thickness: number = 1, backColor: number = 0, foreColor: number = 0xffffff) {

	let g = new Graphics();
	g.beginFill(backColor);
	g.lineStyle(thickness, foreColor);
	g.drawRect(0, 0, size, size);
	g.endFill();

	let tex = skin.addAsTexture('frame', g);

	g.destroy();

	return tex;

}

function addCheck(skin: UiSkin, key: string, size: number = 32, thickness: number = 8, color: number = 0) {

	let g = new Graphics();
	g.lineStyle(thickness, color);

	g.moveTo(-0.45 * size, 0);
	g.lineTo(0, 0.40 * size);
	g.lineTo(0.54 * size, -0.58 * size);

	let tex = skin.addAsTexture(key, g);
	g.destroy();

	return tex;

}

function addCross(skin: UiSkin, key: string, size: number = 32, thickness: number = 8, color: number = 0) {

	let g = new Graphics();
	g.lineStyle(thickness, color);
	g.moveTo(0, 0);
	g.lineTo(size, size);
	g.moveTo(size, 0);
	g.lineTo(0, size);

	let tex = skin.addAsTexture(key, g);
	g.destroy();

	return tex;

}

function addRoundRect(skin: UiSkin, key: string, size: number = 32, fillColor: number = 0xffffff, lineColor: number = 0): Texture {

	let g = new Graphics();
	g.beginFill(fillColor);
	g.lineStyle(1, lineColor);
	g.drawRoundedRect(0, 0, size, size, 4);
	g.endFill();

	let tex = skin.addAsTexture(key, g);

	g.destroy();

	return tex;

}