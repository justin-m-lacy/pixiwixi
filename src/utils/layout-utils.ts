import { DisplayObject, Point, Container, MaskData } from 'pixi.js';


/**
 * Place each clip horizontally after its predecessor, accounting for the width of each,
 * plus additional padding.
 * @param padding 
 * @param clips 
 */
export const orderX = (padding: number, ...clips: Container[]) => {

	if (clips.length <= 0) {
		return;
	}
	let prev = clips[0];

	for (let i = 1; i < clips.length; i++) {

		let cur = clips[i];
		cur.x = prev.x + prev.width + padding;
		prev = cur;

	}

}

/**
 * Place each display vertically after its predecessor, accounting for the height of each,
 * plus additional padding.
 * @param padding 
 * @param clips 
 */
export const orderY = (padding: number, ...clips: Container[]) => {

	if (clips.length <= 0) {
		return;
	}
	let prev = clips[0];

	for (let i = 1; i < clips.length; i++) {

		let cur = clips[i];
		cur.y = prev.x + prev.height + padding;
		prev = cur;

	}

}


/**
 * Get the height of a display objects mask, or 0 if no mask.
 * @param mask 
 * @returns 
 */
export const getMaskWidth = (mask?: Container | MaskData | null): number => {

	if (mask == null) {
		return 0;
	} else if (mask instanceof Container) {
		return mask.width;
	} else {
		return mask.maskObject.getBounds().width;
	}

}

/**
 * Get the height of a display objects mask, or 0 if no mask.
 * @param mask 
 * @returns 
 */
export const getMaskHeight = (mask?: Container | MaskData | null): number => {

	if (mask == null) {
		return 0;
	} else if (mask instanceof Container) {
		return mask.height;
	} else {
		return mask.maskObject.getBounds().height;
	}

}


export const getWidth = (clip: DisplayObject) => {
	return (clip instanceof Container) ? clip.width : clip.getBounds().width;

}

export function getHeight(clip: DisplayObject) {
	if (clip instanceof Container) {
		return clip.height;
	}
	return clip.getBounds().height;
}

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
 * If clip has a parent, the target's coordinates are transformed
 * to the clip's parents coordinate system.
 * @param {DisplayObject} clip - clip to center.
 * @param {DisplayObject} target - target to center on.
 */
export function centerOn(clip: Container, target: Container) {

	let p = clip.parent;

	if (!p || p === target.parent) {
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