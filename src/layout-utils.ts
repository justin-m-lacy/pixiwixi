import { DisplayObject, Point, Sprite } from 'pixi.js';

/**
 * Center's a clip within its parent container.
 * @param {DisplayObject} clip 
 */
export function center(clip: DisplayObject): void {

	let p = clip.parent;
	if (!p) return;

	const pSize = p.getBounds();
	const cSize = clip.getBounds();

	clip.x = 0.5 * (pSize.width - cSize.width);
	clip.y = 0.5 * (pSize.height - cSize.height);

}

/**
 * Center a clip on a target clip.
 * @param {DisplayObject} clip - clip to center.
 * @param {DisplayObject} target - target to center on.
 */
export function centerOn(clip: Sprite, target: Sprite) {

	let p = clip.parent;
	if (!p) return;

	if (clip.parent == target.parent) {
		clip.x = target.x + 0.5 * (target.width - clip.width);
		clip.y = target.y + 0.5 * (target.height - clip.height);
		return;
	}

	let start = new Point(0, 0);
	let end = new Point(target.width, target.height);

	start = p.toLocal(start, target);
	end = p.toLocal(end, target);

	clip.x = 0.5 * (start.x + end.x - clip.width);
	clip.y = 0.5 * (start.y + end.y - clip.height);

}