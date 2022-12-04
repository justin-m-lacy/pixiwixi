import { Rectangle, Container } from 'pixi.js';
import { ListLayout, Orientation, Align, isLayout, alignItem } from './layout';
import { ILayout } from './layout';



/**
 * Lays out container children in order without regard for size or available space.
 */
export class FlowLayout extends ListLayout {

	private flow: Orientation = Orientation.Horizontal;

	private align: Align;

	private spacing: number = 0;



	constructor(params: { items?: (ILayout | Container)[], flow?: Orientation, spacing?: number, align?: Align }) {

		super(params.items);


		this.flow = params.flow ?? Orientation.Vertical;
		this.spacing = params.spacing ?? 0;
		this.align = params.align ?? Align.Center;

	}


	public layout(rect: Rectangle, parent: Container): Container {

		const padding = this.spacing;
		const items = this.items;
		const len = items.length;

		/// space used.
		const available = new Rectangle(rect.x, rect.y, rect.width, rect.height);


		let sizeProp: 'width' | 'height';
		let prop: 'x' | 'y';
		let alignAxis: Orientation;

		if (this.flow === Orientation.Horizontal) {
			prop = 'x';
			sizeProp = 'width';
			alignAxis = Orientation.Vertical;
		} else {
			prop = 'y';
			sizeProp = 'height';
			alignAxis = Orientation.Horizontal;
		}

		let child: Container | ILayout;


		for (let i = 0; i < len; i++) {

			child = items[i];
			if (isLayout(child)) {
				child = child.layout(available);
			} else {
				child[prop] = available[prop];
			}
			console.log(`child pos: ${child[prop]}`);

			/// advance available rect.
			available[prop] = child[prop] + child[sizeProp] + padding;
			// decrease available space.
			available[sizeProp] -= (child[sizeProp] + padding);

			alignItem(child, rect, alignAxis, this.align);

		}

		return parent;

	} // arrange()

}