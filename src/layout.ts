import { DisplayObject } from 'pixi.js';

export default interface Layout {
	arrange(container: DisplayObject): void;
}