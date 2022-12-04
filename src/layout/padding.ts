import { ILayout, isLayout, IDisplay } from './layout';
import { Rectangle, Container } from 'pixi.js';

/**
 * Attempts to ensure a minimal amount of padding around object.
 * Will not rescale if object does not fit in bounds.
 */
export class Padding implements ILayout {

    private readonly padding: { left: number, right: number, top: number, bottom: number };

    private child: ILayout | Container;

    static All(space: number, child: ILayout | Container) {
        return new Padding(
            {
                left: space, right: space, top: space, bottom: space
            },
            child
        );
    }

    static Sides(horizontal: number, vertical: number, child: ILayout | Container) {
        return new Padding(
            {
                left: horizontal, right: horizontal, top: vertical, bottom: vertical
            },
            child
        );
    }

    constructor(padding: { left: number, right: number, top: number, bottom: number }, child: ILayout | Container,) {
        this.padding = padding;
        this.child = child;
    }

    public layout(rect: Rectangle, parent?: Container): IDisplay {

        const pad = this.padding;

        /// width/height 0 if size is smaller than required padding.
        const padRect = new Rectangle(rect.x + pad.left, rect.y + pad.top,);

        if (rect.width > pad.left + pad.right) {
            padRect.width = rect.width - (pad.left + pad.right);
        }

        if (rect.height > pad.top + pad.bottom) {
            padRect.height = rect.height - (pad.top + pad.bottom);
        }

        if (isLayout(this.child)) {
            return this.child.layout(padRect, parent);
        } else {

            this.shrinkChild(padRect, this.child);
            return this.child;

        }

    }

    private shrinkChild(rect: Rectangle, child: Container,): Container {

        if (child.width > rect.width) {
            child.width = rect.width;
        }
        if (child.x < rect.x) {
            child.x = rect.x;
        } else if (child.x > rect.right) {
            child.x = rect.right;
        }

        if (child.height > rect.height) {
            child.height = rect.height;
        }
        if (child.y < rect.y) {
            child.y = rect.y;
        } else if (child.y > rect.bottom) {
            child.y = rect.bottom;
        }


        return child;

    }



}