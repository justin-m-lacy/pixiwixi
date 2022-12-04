import { Container, DisplayObject, Rectangle } from 'pixi.js';

import { ILayout, isLayout, intersect, IDisplay } from './layout';

/**
 * Limit layout rect of child.
 */
export class SizedBox implements ILayout {

    private rect: Rectangle;

    private readonly child: Container | ILayout;

    constructor(child: Container | ILayout, rect: Rectangle) {

        this.rect = rect;
        this.child = child;

    }

    layout(rect: Rectangle, parent?: Container<DisplayObject>): IDisplay {

        let constrain = intersect(this.rect, rect);

        let child;
        if (isLayout(this.child)) {
            child = this.child.layout(constrain, parent);
        } else {
            child = this.child;

            if (child.x < constrain.x) {
                child.x = constrain.x;
            } else if (child.x + child.width > constrain.right) {
                child.x = constrain.right - child.width;
            }

            if (child.y < constrain.y) {
                child.y = constrain.y;
            } else if (child.y + child.height > constrain.bottom) {
                child.y = constrain.bottom - child.height;
            }

        }



        return child;

    }





}