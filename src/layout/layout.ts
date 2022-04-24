import { DisplayObject, Container, Rectangle } from 'pixi.js';

export const isLayout = (item: any): item is ILayout => {
	return (item as ILayout).arrange !== undefined;
}

export interface ILayout {

	arrange(rect?: Rectangle): void;

}

export abstract class SingleChildLayout implements ILayout {

	readonly child: DisplayObject | Layout;
	constructor(child: DisplayObject | Layout) {
		this.child = child;
	}
	abstract arrange(rect?: Rectangle): void;

}

export default abstract class Layout implements ILayout {


	readonly children: Array<DisplayObject | ILayout>;

	constructor(children?: Array<DisplayObject | ILayout>) {
		this.children = children ?? [];

	}

	abstract arrange(rect?: Rectangle): void;

}