import { Container, Rectangle } from 'pixi.js';
import { ILayout, Axis, Align, alignItem, isLayout, IDisplay, Positionable } from './layout';


export class Separate implements ILayout {

    private readonly first: ILayout | Container;
    private readonly second: ILayout | Container;

    private axis: Axis;

    /**
     * Cross-axis position.
     */
    private align: Align;

    constructor(first: ILayout | Container, second: ILayout | Container, axis: Axis = Axis.Vertical, align: Align = Align.Center) {

        this.first = first;
        this.second = second;

        this.axis = axis;
        this.align = align;

    }

    public layout(rect: Rectangle, parent: Container): IDisplay {

        const child1 = isLayout(this.first) ? this.first.layout(rect, parent) : this.first;
        const child2 = isLayout(this.second) ? this.second.layout(rect, parent) : this.second;

        if (this.axis === Axis.Horizontal) {

            child1.x = rect.x;
            child2.x = rect.x + rect.width - child2.width;

            alignItem(child1, rect, Axis.Vertical, this.align);
            alignItem(child2, rect, Axis.Vertical, this.align);

        } else {

            child1.y = rect.y;
            child2.y = rect.y + rect.height - child2.height;

            alignItem(child1, rect, Axis.Horizontal, this.align);
            alignItem(child2, rect, Axis.Horizontal, this.align);

        }

        return new Positionable([child1, child2,], rect);

    }

}