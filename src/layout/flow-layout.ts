import { FlowDirection } from '../../index';
import { Container, DisplayObject, Rectangle } from 'pixi.js';

export default class FlowLayout {

	flow: FlowDirection = FlowDirection.HORIZONTAL;
	padding: number = 0;

	constructor(flow: FlowDirection = FlowDirection.HORIZONTAL, padding: number = 4) {

		this.flow = flow;
		this.padding = padding;

	}

	arrange(container: Container) {

		let padding = this.padding;
		let children = container.children;
		let len = children.length;
		let clip: DisplayObject;
		let bounds: Rectangle;
		let sizeProp: 'width' | 'height';
		let prop: 'x' | 'y';

		if (this.flow === FlowDirection.HORIZONTAL) {
			prop = 'x';
			sizeProp = 'width';
		} else {
			prop = 'y';
			sizeProp = 'height';
		}

		let v = padding;

		for (let i = 0; i < len; i++) {

			clip = children[i];
			if (clip.visible === false) continue;
			clip[prop] = v;
			bounds = clip.getBounds();
			v += padding + bounds[sizeProp];

		}

	}

}