import { FlowDirection } from '../../index';
import { Container, DisplayObject, Rectangle } from 'pixi.js';
import Layout from './layout';
import { isLayout, ILayout } from './layout';

export default class FlowLayout extends Layout {

	flow: FlowDirection = FlowDirection.HORIZONTAL;
	padding: number = 0;

	constructor(flow: FlowDirection = FlowDirection.HORIZONTAL, padding: number = 4) {

		super();

		this.flow = flow;
		this.padding = padding;

	}

	arrange(rect?: Rectangle) {

		const padding = this.padding;
		const children = this.children;
		const len = children.length;
		let clip: DisplayObject | ILayout;
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

		let v: number = this.padding;

		for (let i = 0; i < len; i++) {

			clip = children[i];

			if (isLayout(clip)) {

			} else {
				if (clip.visible === false) continue;
				clip[prop] = v;
				bounds = clip.getBounds();
				v += padding + bounds[sizeProp];
			}

		}

	}

}