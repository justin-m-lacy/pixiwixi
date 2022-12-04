import { Rectangle, Container } from 'pixi.js';

export enum Align {
	Center = 0,
	Start = 1,
	End = 2,
	Stretch
}

export enum Axis {
	Horizontal = 1,
	Vertical
}

export const isLayout = (item: any): item is ILayout => {
	return (item as ILayout).layout !== undefined;
}

export interface IDisplay {
	x: number;
	y: number;
	width: number;
	height: number;
	visible: boolean;
}

export const NoDisplay = (): IDisplay => ({

	x: 0,
	y: 0,
	width: 0,
	height: 0,
	visible: false

})

/**
 * Positionable can be used to reposition a collection of display objects
 * returned from a layout function.
 * This is for cases when a layout() function can't return the parent
 * Container, either because the container contains unrelated child clips
 * with their own layouts,
 * or beceause the objects layed out don't share the same parent.
 */
export class Positionable implements IDisplay {

	private readonly items;
	private readonly rect: Rectangle;

	public get x() { return this.rect.x }
	public set x(v) {

		const dx = v - this.rect.x;
		this.rect.x = v;

		for (let i = this.items.length - 1; i >= 0; i--) {
			this.items[i].x += dx;
		}

	}

	get visible() { return this._visible }
	set visible(v) {
		this._visible = v;
		for (let i = this.items.length - 1; i >= 0; i--) {
			this.items[i].visible = v;
		}
	}

	public get y() { return this.rect.y }
	public set y(v) {

		const dy = v - this.rect.y;
		this.rect.y = v;

		for (let i = this.items.length - 1; i >= 0; i--) {
			this.items[i].y += dy;
		}

	}

	public get width() { return this.rect.width }
	public set width(v) {
		/// do nothing for now.
		this.rect.width = v;
	}
	public get height() { return this.rect.height }
	public set height(v) {
		/// do nothing for now.
		this.rect.height = v;
	}

	private _visible: boolean;

	constructor(items: IDisplay[], rect: Rectangle) {

		this.items = items;
		this._visible = this.items.some(v => v.visible);

		this.rect = new Rectangle(rect.x, rect.y, rect.width, rect.height);

	}

}

export interface ILayout {

	/**
	 * A function that arranges objects within the given rectangle, and returns
	 * an object which can be used to adjust the child's position.
	* @param rect - Space available for items being placed.
	* @todo Some convention should be established
	* for infinite space in a direction.
	* @parent - container which contains the display objects laid out.
	* @returns object that can be used to further modify the position
	* of the child layout, if appropriate..
	*/
	layout(rect: Rectangle, parent?: Container): IDisplay;

}


export abstract class ChildLayout implements ILayout {

	readonly child: ILayout | Container;
	constructor(child: ILayout | Container) {
		this.child = child;
	}
	public layout(rect: Rectangle, parent?: Container): IDisplay {

		const child = isLayout(this.child) ? this.child.layout(rect, parent) : this.child;
		return this.onLayout?.(rect,
			child, parent
		) ?? child;

	}

	abstract onLayout(rect: Rectangle, child: IDisplay, parent?: Container): IDisplay;

}

export abstract class ListLayout implements ILayout {

	readonly items: (ILayout | Container)[];


	constructor(items?: (ILayout | Container)[]) {

		this.items = items ?? [];
	}

	abstract layout(rect: Rectangle, parent?: Container): IDisplay;

}


export const placeCenterY = (child: IDisplay, rect: Rectangle) => {
	child.y = rect.y + (rect.height - child.height) / 2;
}

export const placeStartY = (child: IDisplay, rect: Rectangle) => {
	child.y = rect.y;
}

export const placeEndY = (child: IDisplay, rect: Rectangle) => {
	child.y = rect.y + rect.height - child.height;
}

export const placeCenterX = (child: IDisplay, rect: Rectangle) => {
	child.x = rect.y + (rect.width - child.width) / 2;
}

export const placeStartX = (child: IDisplay, rect: Rectangle) => {
	child.x = rect.x;
}

export const placeEndX = (child: IDisplay, rect: Rectangle) => {
	child.x = rect.x + rect.width - child.width;
}

/**
 * Return rect containing both r1 and r2
 */
export const intersect = (r1: Rectangle, r2: Rectangle) => {

	let x = Math.max(r1.x, r2.x), y = Math.max(r1.y, r2.y);
	let right = Math.min(r1.right, r2.right), bottom = Math.min(r1.bottom, r1.bottom);

	return new Rectangle(x, y,
		right > x ? right - x : 0,
		bottom > y ? bottom - y : 0
	);

}

/**
 * @param child
 * @param rect 
 * @param axis - Main axis of alignment.
 * @param align 
 */
export const alignItem = (child: IDisplay, rect: Rectangle, axis: Axis, align: Align) => {

	if (axis === Axis.Horizontal) {

		if (align === Align.Center) {
			placeCenterX(child, rect);
		} else if (align === Align.Start) {
			placeStartX(child, rect);
		} else if (align === Align.End) {
			placeEndX(child, rect);
		} else if (align === Align.Stretch) {
			child.x = rect.x;
			child.width = rect.width;

		}

	} else {

		if (align === Align.Center) {
			placeCenterY(child, rect);
		} else if (align === Align.Start) {
			placeStartY(child, rect);
		} else if (align === Align.End) {
			placeEndY(child, rect);
		} else if (align === Align.Stretch) {
			child.height = rect.height
			child.y = rect.y;

		}
	}

}