import { DisplayObject, Rectangle, Container } from 'pixi.js';
import { ListLayout, Align, alignItem, Axis, IDisplay } from './layout';
import { isLayout, ILayout } from './layout';

export enum FlowDirection {
    Horizontal,
    Vertical
}

/**
 * Equally space all children. All space is used.
 */
export class EqualSpace extends ListLayout {

    readonly flow: FlowDirection = FlowDirection.Horizontal;

    readonly align: Align;

    private readonly parent?: Container;

    constructor(items?: ILayout[],

        parent?: Container,
        flow: FlowDirection = FlowDirection.Horizontal,
        align: Align = Align.Center
    ) {

        super(items);

        this.align = align;
        this.parent = parent;

        this.flow = flow;


    }

    public layout(rect: Rectangle, parent: Container): IDisplay {

        if (this.items.length > 0) {

            if (this.flow === FlowDirection.Horizontal) {
                this.layoutX(rect);
            } else {
                this.layoutY(rect);
            }
        }

        return parent;

    } // arrange()

    private layoutX(rect: Rectangle) {

        const items = this.items;
        const len = items.length;
        let child: Container | ILayout;
        let display: IDisplay;

        const space = new Rectangle(rect.x, rect.y, rect.width / len, rect.height);

        for (let i = 0; i < len; i++) {

            child = items[i];
            if (isLayout(child)) display = child.layout(space);
            else {
                display = child;
                child.position.set(space.x, space.y);
            }

            if (display instanceof DisplayObject) {
                this.parent?.addChild(display);
            }
            space.x += space.width;

            alignItem(display, space, Axis.Vertical, this.align);
        }

    }

    private layoutY(rect: Rectangle) {

        const items = this.items;
        const len = items.length;
        let child: Container | ILayout;
        let display: IDisplay;

        const space = new Rectangle(rect.x, rect.y, rect.width, rect.height / len);

        for (let i = 0; i < len; i++) {

            child = items[i];
            if (isLayout(child)) display = child.layout(space);
            else {
                display = child;
                child.position.set(space.x, space.y);
            }

            if (display instanceof DisplayObject) {
                this.parent?.addChild(display);
            }
            space.y += space.height;

            alignItem(display, space, Axis.Horizontal, this.align);
        }

    }

}