import { DisplayObject, Rectangle, Container } from 'pixi.js';

export enum Anchors {

	Top,
	Bottom,
	Left,
	Right,
	Center,

};


export const isLayout = (item: any): item is ILayout => {
	return (item as ILayout).arrange !== undefined;
}

export interface ILayout {

	arrange(container: Container, rect?: Rectangle): void;

}

export abstract class SingleChildLayout implements ILayout {

	readonly child: DisplayObject | Layout;
	constructor(child: DisplayObject | Layout) {
		this.child = child;
	}
	abstract arrange(container: Container, rect?: Rectangle): void;

}

export abstract class Layout implements ILayout {


	readonly children: Array<DisplayObject | ILayout>;

	constructor(children?: Array<DisplayObject | ILayout>) {
		this.children = children ?? [];

	}

	abstract arrange(container: Container, rect?: Rectangle): void;

}